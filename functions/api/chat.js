// Cloudflare Pages Function — /api/chat
// Mirrors the Vercel serverless function at src/app/api/chat/route.ts

const BENGALI_RULES = {
  'ধান': 'ধান চাষের জন্য মাটির pH ৫.৫-৬.৫ হওয়া উচিত। সঠিক সময়ে সার প্রয়োগ করুন এবং পানি নিষ্কাশন নিশ্চিত করুন।',
  'গম': 'গম চাষের জন্য শীতকাল সবচেয়ে ভালো সময়। ডিএই সার প্রয়োগ করুন।',
  'পাট': 'পাট চাষের জন্য বর্ষাকাল উপযুক্ত। টিএসপি ও এমপি সার ব্যবহার করুন।',
  'আলু': 'আলু চাষের জন্য শীতকাল সবচেয়ে ভালো। বীজ আলু ভালোভাবে কাটুন।',
  'রোগ': 'গাছে রোগ দেখা দিলে দ্রুত কৃষি অফিসারের পরামর্শ নিন। সঠিক কীটনাশক ব্যবহার করুন।',
  'সার': 'মাটি পরীক্ষা করে সার প্রয়োগ করুন। জৈব সার ও রাসায়নিক সারের সমন্বয় করুন।',
  'পানি': 'সেচ ব্যবস্থার উন্নয়ন করুন। ড্রিপ সেচ ব্যবহার করুন।',
  'কীট': 'উপকারী পোকা সংরক্ষণ করুন। আলোর ফাঁদ ব্যবহার করুন।',
};

function getRuleResponse(msg) {
  let response = '';
  for (const [key, val] of Object.entries(BENGALI_RULES)) {
    if (msg.includes(key)) response += val + '\n\n';
  }
  return response || 'কৃষি বিষয়ে আপনার প্রশ্নের জন্য ধন্যবাদ! অনুগ্রহ করে ধান, গম, রোগ, সার, পানি বা কীট সম্পর্কে জিজ্ঞাসা করুন।';
}

export async function onRequestPost(context) {
  try {
    const { message } = await context.request.json();
    if (!message) return new Response(JSON.stringify({ error: 'Message required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Try Gemini
    const apiKey = context.env?.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: message }] }],
              systemInstruction: { parts: [{ text: 'তুমি কৃষি এআই — বাংলাদেশের কৃষকদের জন্য কৃষি সহায়ক। সব উত্তর বাংলায় দাও।' }] },
              generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return new Response(JSON.stringify({ response: text, source: 'gemini' }), { headers: { 'Content-Type': 'application/json' } });
        }
      } catch {}
    }

    // Rule-based fallback
    return new Response(JSON.stringify({ response: getRuleResponse(message), source: 'rules' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ response: getRuleResponse(''), source: 'rules' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
