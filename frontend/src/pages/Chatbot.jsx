import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Globe, ChevronDown, Image, X } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', greeting: 'Hello! I am your AI farming assistant. Ask me about crops, weather, pest control, or market prices.' },
  { code: 'hi', label: 'हिंदी', greeting: 'नमस्ते! मैं आपका AI कृषि सहायक हूँ। फसल, मौसम, कीट नियंत्रण या बाजार भाव के बारे में पूछें।' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਫ਼ਸਲ, ਮੌਸਮ ਜਾਂ ਕੀੜੇ ਬਾਰੇ ਪੁੱਛੋ।' },
  { code: 'bn', label: 'বাংলা', greeting: 'নমস্কার! আমি আপনার AI কৃষি সহায়ক। ফসল, আবহাওয়া, কীটপতঙ্গ বা বাজার মূল্য সম্পর্কে জিজ্ঞাসা করুন।' },
  { code: 'ta', label: 'தமிழ்', greeting: 'வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். பயிர்கள், வானிலை, பூச்சி கட்டுப்பாடு பற்றி கேளுங்கள்।' },
  { code: 'te', label: 'తెలుగు', greeting: 'నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. పంటలు, వాతావరణం, తెగుళ్ళ గురించి అడగండి।' },
  { code: 'mr', label: 'मराठी', greeting: 'नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. पीक, हवामान, कीड नियंत्रण किंवा बाजारभावाबद्दल विचारा।' },
  { code: 'gu', label: 'ગુજરાતી', greeting: 'નમસ્તે! હું તમારો AI ખેતી સહાયક છું. પાક, હવામાન, જીવાત નિયંત્રણ અથવા બજાર ભાવ વિશે પૂછો।' },
  { code: 'kn', label: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆ, ಹವಾಮಾನ, ಕೀಟ ನಿಯಂತ್ರಣ ಬಗ್ಗೆ ಕೇಳಿ।' },
  { code: 'ml', label: 'മലയാളം', greeting: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായി. വിള, കാലാവസ്ഥ, കീടനിയന്ത്രണം എന്നിവ ചോദിക്കൂ।' },
  { code: 'or', label: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ AI କୃଷି ସହାୟକ। ଫସଲ, ପାଣିପାଗ, କୀଟ ନିୟନ୍ତ୍ରଣ ବିଷୟରେ ପଚାରନ୍ତୁ।' },
  { code: 'ur', label: 'اردو', greeting: 'السلام علیکم! میں آپ کا AI زراعت معاون ہوں۔ فصل، موسم، کیڑوں یا منڈی کے بھاؤ کے بارے میں پوچھیں۔' },
];

const RESPONSES = {
  en: {
    weather: "Based on current weather data for your region: expect light rain in the next 48 hours with humidity at 78%. Avoid pesticide spraying. Soil moisture is optimal — pause irrigation to save water and electricity.",
    disease: "For pest and disease control: 1) Neem oil spray (5ml/L) is effective for most soft-bodied insects. 2) Copper-based fungicides work well for fungal infections. 3) For severe infestations, contact your local Krishi Vigyan Kendra (KVK) for chemical recommendations specific to your crop.",
    crop: "Based on current soil pH (6.5) and upcoming weather patterns: Wheat and Mustard are excellent choices for the Rabi season. For Kharif, consider Soybean or Maize. Ensure proper seed treatment before sowing.",
    price: "Current market prices (MSP 2024-25): Wheat ₹2,275/Qtl, Paddy ₹2,300/Qtl, Mustard ₹5,650/Qtl, Soybean ₹4,892/Qtl, Maize ₹2,225/Qtl. Check your nearest APMC mandi for live rates.",
    irrigation: "Smart irrigation tip: With current soil moisture at 65% and rain forecast in 2 days, skip today's irrigation cycle. Use drip irrigation for 40% water savings. Best time to irrigate: early morning (5-7 AM) to minimize evaporation.",
    fertilizer: "Fertilizer recommendation: Apply NPK 120:60:40 kg/hectare for wheat. Use DAP at sowing and urea in splits (50% at sowing, 25% at tillering, 25% at jointing). Avoid over-application — it reduces yield and pollutes groundwater.",
    default: "I can help you with: crop selection, disease identification, weather-based advisories, market prices, irrigation scheduling, and fertilizer recommendations. What specific farming challenge can I assist you with today?"
  },
  hi: {
    weather: "आपके क्षेत्र के मौसम के अनुसार: अगले 48 घंटों में हल्की बारिश की संभावना है, नमी 78% है। कीटनाशक छिड़काव न करें। मिट्टी की नमी सही है — सिंचाई रोकें और बिजली बचाएं।",
    disease: "कीट और रोग नियंत्रण के लिए: 1) नीम तेल स्प्रे (5ml/L) अधिकांश कीड़ों के लिए प्रभावी है। 2) फफूंद संक्रमण के लिए कॉपर-आधारित फफूंदनाशक उपयोग करें। 3) गंभीर संक्रमण के लिए अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।",
    crop: "वर्तमान मिट्टी pH (6.5) और मौसम के आधार पर: रबी सीजन के लिए गेहूं और सरसों उत्तम विकल्प हैं। खरीफ के लिए सोयाबीन या मक्का उगाएं। बुवाई से पहले बीज उपचार जरूर करें।",
    price: "वर्तमान बाजार भाव (MSP 2024-25): गेहूं ₹2,275/क्विंटल, धान ₹2,300/क्विंटल, सरसों ₹5,650/क्विंटल, सोयाबीन ₹4,892/क्विंटल, मक्का ₹2,225/क्विंटल। लाइव रेट के लिए अपनी नजदीकी APMC मंडी देखें।",
    irrigation: "स्मार्ट सिंचाई सुझाव: वर्तमान मिट्टी नमी 65% है और 2 दिन में बारिश का अनुमान है, आज सिंचाई न करें। ड्रिप सिंचाई से 40% पानी बचाएं। सिंचाई का सबसे अच्छा समय: सुबह 5-7 बजे।",
    fertilizer: "उर्वरक सिफारिश: गेहूं के लिए NPK 120:60:40 किग्रा/हेक्टेयर डालें। बुवाई पर DAP और यूरिया को तीन भागों में दें। अधिक उर्वरक से उपज कम होती है और भूजल प्रदूषित होता है।",
    default: "मैं आपकी मदद कर सकता हूं: फसल चयन, रोग पहचान, मौसम आधारित सलाह, बाजार भाव, सिंचाई समय-सारणी और उर्वरक सिफारिशें। आज आप किस खेती की समस्या के बारे में जानना चाहते हैं?"
  },
  pa: {
    weather: "ਤੁਹਾਡੇ ਖੇਤਰ ਦੇ ਮੌਸਮ ਅਨੁਸਾਰ: ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਕੀਟਨਾਸ਼ਕ ਨਾ ਛਿੜਕੋ। ਮਿੱਟੀ ਦੀ ਨਮੀ ਠੀਕ ਹੈ — ਸਿੰਚਾਈ ਰੋਕੋ।",
    disease: "ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀ ਕੰਟਰੋਲ: ਨਿੰਮ ਤੇਲ ਸਪ੍ਰੇ (5ml/L) ਜ਼ਿਆਦਾਤਰ ਕੀੜਿਆਂ ਲਈ ਅਸਰਦਾਰ ਹੈ। ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਲਈ ਕਾਪਰ-ਆਧਾਰਿਤ ਉੱਲੀਨਾਸ਼ਕ ਵਰਤੋ।",
    crop: "ਮੌਜੂਦਾ ਮਿੱਟੀ pH (6.5) ਦੇ ਆਧਾਰ 'ਤੇ: ਰਬੀ ਸੀਜ਼ਨ ਲਈ ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਵਧੀਆ ਵਿਕਲਪ ਹਨ। ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜ ਉਪਚਾਰ ਜ਼ਰੂਰ ਕਰੋ।",
    price: "ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ (MSP 2024-25): ਕਣਕ ₹2,275/ਕੁਇੰਟਲ, ਝੋਨਾ ₹2,300/ਕੁਇੰਟਲ, ਸਰ੍ਹੋਂ ₹5,650/ਕੁਇੰਟਲ। ਲਾਈਵ ਰੇਟ ਲਈ ਆਪਣੀ ਨੇੜੇ ਦੀ APMC ਮੰਡੀ ਦੇਖੋ।",
    irrigation: "ਸਮਾਰਟ ਸਿੰਚਾਈ ਸੁਝਾਅ: ਮਿੱਟੀ ਦੀ ਨਮੀ 65% ਹੈ ਅਤੇ 2 ਦਿਨਾਂ ਵਿੱਚ ਬਾਰਿਸ਼ ਦਾ ਅਨੁਮਾਨ ਹੈ। ਅੱਜ ਸਿੰਚਾਈ ਨਾ ਕਰੋ। ਡ੍ਰਿੱਪ ਸਿੰਚਾਈ ਨਾਲ 40% ਪਾਣੀ ਬਚਾਓ।",
    fertilizer: "ਖਾਦ ਸਿਫਾਰਿਸ਼: ਕਣਕ ਲਈ NPK 120:60:40 ਕਿਲੋ/ਹੈਕਟੇਅਰ ਪਾਓ। DAP ਬਿਜਾਈ ਵੇਲੇ ਅਤੇ ਯੂਰੀਆ ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਦਿਓ।",
    default: "ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ: ਫ਼ਸਲ ਚੋਣ, ਬਿਮਾਰੀ ਪਛਾਣ, ਮੌਸਮ ਆਧਾਰਿਤ ਸਲਾਹ, ਮੰਡੀ ਭਾਅ, ਸਿੰਚਾਈ ਅਤੇ ਖਾਦ ਸਿਫਾਰਿਸ਼ਾਂ। ਅੱਜ ਕਿਸ ਖੇਤੀ ਸਮੱਸਿਆ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?"
  },
  bn: {
    weather: "আপনার অঞ্চলের আবহাওয়া অনুযায়ী: পরবর্তী ৪৮ ঘণ্টায় হালকা বৃষ্টির সম্ভাবনা, আর্দ্রতা ৭৮%। কীটনাশক স্প্রে করবেন না। মাটির আর্দ্রতা সঠিক — সেচ বন্ধ রাখুন।",
    disease: "কীটপতঙ্গ ও রোগ নিয়ন্ত্রণ: নিম তেল স্প্রে (৫ml/L) বেশিরভাগ পোকার জন্য কার্যকর। ছত্রাক সংক্রমণের জন্য কপার-ভিত্তিক ছত্রাকনাশক ব্যবহার করুন।",
    crop: "বর্তমান মাটির pH (৬.৫) এবং আবহাওয়ার ভিত্তিতে: রবি মৌসুমে গম ও সরিষা উত্তম। খরিফে সয়াবিন বা ভুট্টা চাষ করুন।",
    price: "বর্তমান বাজার মূল্য (MSP ২০২৪-২৫): গম ₹২,২৭৫/কুইন্টাল, ধান ₹২,৩০০/কুইন্টাল, সরিষা ₹৫,৬৫০/কুইন্টাল। লাইভ রেটের জন্য নিকটতম APMC মান্ডি দেখুন।",
    irrigation: "স্মার্ট সেচ পরামর্শ: মাটির আর্দ্রতা ৬৫% এবং ২ দিনে বৃষ্টির পূর্বাভাস। আজ সেচ দেবেন না। ড্রিপ সেচে ৪০% জল সাশ্রয় হয়।",
    fertilizer: "সার সুপারিশ: গমের জন্য NPK ১২০:৬০:৪০ কেজি/হেক্টর দিন। বপনে DAP এবং ইউরিয়া তিন ভাগে দিন।",
    default: "আমি সাহায্য করতে পারি: ফসল নির্বাচন, রোগ সনাক্তকরণ, আবহাওয়া-ভিত্তিক পরামর্শ, বাজার মূল্য, সেচ সময়সূচি এবং সার সুপারিশ। আজ কোন কৃষি সমস্যায় সাহায্য চান?"
  },
};

// For other languages, fall back to English responses with a note
const getFallbackResponses = (langCode) => ({
  weather: RESPONSES.en.weather,
  disease: RESPONSES.en.disease,
  crop: RESPONSES.en.crop,
  price: RESPONSES.en.price,
  irrigation: RESPONSES.en.irrigation,
  fertilizer: RESPONSES.en.fertilizer,
  default: RESPONSES.en.default,
});

const getResponse = (message, langCode) => {
  const lower = message.toLowerCase();
  const r = RESPONSES[langCode] || getFallbackResponses(langCode);
  if (lower.includes('weather') || lower.includes('rain') || lower.includes('मौसम') || lower.includes('ਮੌਸਮ') || lower.includes('বৃষ্টি') || lower.includes('বাদল')) return r.weather;
  if (lower.includes('disease') || lower.includes('pest') || lower.includes('insect') || lower.includes('रोग') || lower.includes('कीट') || lower.includes('ਕੀੜੇ') || lower.includes('রোগ')) return r.disease;
  if (lower.includes('crop') || lower.includes('grow') || lower.includes('sow') || lower.includes('फसल') || lower.includes('ਫ਼ਸਲ') || lower.includes('ফসল')) return r.crop;
  if (lower.includes('price') || lower.includes('market') || lower.includes('msp') || lower.includes('भाव') || lower.includes('मंडी') || lower.includes('ਭਾਅ') || lower.includes('মূল্য')) return r.price;
  if (lower.includes('irrigat') || lower.includes('water') || lower.includes('सिंचाई') || lower.includes('ਸਿੰਚਾਈ') || lower.includes('সেচ')) return r.irrigation;
  if (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('urea') || lower.includes('उर्वरक') || lower.includes('खाद') || lower.includes('ਖਾਦ') || lower.includes('সার')) return r.fertilizer;
  return r.default;
};

const Chatbot = () => {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: LANGUAGES[0].greeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const langMenuRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const handleClick = (e) => { if (langMenuRef.current && !langMenuRef.current.contains(e.target)) setShowLangMenu(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLanguage = (lang) => {
    setSelectedLang(lang);
    setShowLangMenu(false);
    setMessages([{ role: 'bot', text: lang.greeting }]);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = getResponse(userMsg, selectedLang.code);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setIsLoading(false);
  };

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    const langMap = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', or: 'or-IN', ur: 'ur-IN' };
    recognition.lang = langMap[selectedLang.code] || 'en-IN';
    recognition.interimResults = false;
    if (isListening) { recognition.stop(); setIsListening(false); return; }
    setIsListening(true);
    recognition.start();
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const quickQuestions = {
    en: ['What crops should I grow?', 'Current market prices?', 'Weather advisory today', 'Irrigation schedule'],
    hi: ['कौन सी फसल उगाएं?', 'आज के बाजार भाव?', 'मौसम सलाह', 'सिंचाई कब करें?'],
    pa: ['ਕਿਹੜੀ ਫ਼ਸਲ ਉਗਾਈਏ?', 'ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ?', 'ਮੌਸਮ ਸਲਾਹ', 'ਸਿੰਚਾਈ ਕਦੋਂ ਕਰੀਏ?'],
    bn: ['কোন ফসল চাষ করব?', 'আজকের বাজার মূল্য?', 'আবহাওয়া পরামর্শ', 'সেচের সময়সূচি'],
  };
  const currentQuick = quickQuestions[selectedLang.code] || quickQuestions.en;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Smart AI Assistant</h2>
            <p className="text-green-200 text-xs">Powered by SmartCrop AI • Always available</p>
          </div>
        </div>
        {/* Language Selector */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setShowLangMenu(p => !p)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-sm font-medium transition"
          >
            <Globe size={16} />
            <span>{selectedLang.label}</span>
            <ChevronDown size={14} />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 w-48 max-h-72 overflow-y-auto">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition first:rounded-t-2xl last:rounded-b-2xl ${selectedLang.code === lang.code ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-5">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && (
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mb-1">
                <Bot size={18} className="text-green-700" />
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'}`}>
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mb-1">
                <User size={18} className="text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-green-700" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 pt-3 pb-1 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
        {currentQuick.map((q, i) => (
          <button
            key={i}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-full transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListen}
            className={`p-3 rounded-full transition-colors flex-shrink-0 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            title="Voice Input"
          >
            <Mic size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={selectedLang.code === 'hi' ? 'अपना सवाल यहाँ लिखें...' : selectedLang.code === 'pa' ? 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...' : 'Type your farming question...'}
            className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
