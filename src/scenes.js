const base = import.meta.env.BASE_URL;

// Scroll units before the first scene and after the last one.
export const INTRO = 0.8;
export const OUTRO = 0.9;

// The AI-made morph between scene 7 (dallah) and scene 8 (the cup).
// `from` is the index of the scene the video starts on. If the file is missing,
// the site falls back to the normal zoom + crossfade for that step.
export const VIDEO = { from: 6, src: `${base}videos/morph-7-8.mp4` };

export const ui = {
  en: { brand: 'Saudi Coffee', scroll: 'Scroll', again: 'Start again', scene: 'Scene', toggle: 'عربي', toggleLabel: 'Switch to Arabic' },
  ar: { brand: 'القهوة السعودية', scroll: 'مرّر للأسفل', again: 'ابدأ من جديد', scene: 'المشهد', toggle: 'EN', toggleLabel: 'Switch to English' },
};

export const hero = {
  en: { title: 'Saudi Coffee', kicker: 'A journey from the mountain to the cup' },
  ar: { title: 'القهوة السعودية', kicker: 'رحلة من الجبل إلى الفنجان' },
};

export const closing = {
  en: { title: 'A welcome in every cup' },
  ar: { title: 'ترحيبٌ في كل فنجان' },
};

// `fallback` is the gradient shown if an image file is not there yet.
export const scenes = [
  {
    id: 'mountain',
    image: `${base}images/scene-1.png`,
    fallback: 'linear-gradient(180deg,#27402e 0%,#5b7a4b 45%,#c9a25f 100%)',
    en: { title: 'Where it begins', text: 'High in the mountains of the southwest, coffee grows on stone-walled terraces above the mist.', alt: 'Terraced coffee farms on misty mountains at sunrise' },
    ar: { title: 'من هنا تبدأ', text: 'في مرتفعات الجنوب الغربي، تنمو أشجار البن على مدرجات حجرية تعلو الضباب.', alt: 'مدرجات بن على جبال يكسوها الضباب عند الشروق' },
  },
  {
    id: 'cherries',
    image: `${base}images/scene-2.png`,
    fallback: 'linear-gradient(180deg,#2f4a2a 0%,#7a3b2a 60%,#c4552f 100%)',
    en: { title: 'Ripe with patience', text: 'Cherries turn red one by one, so the harvest is never rushed.', alt: 'Ripe red coffee cherries covered in dew' },
    ar: { title: 'نضجٌ على مهل', text: 'تحمرّ الثمار واحدة تلو الأخرى، فلا يُستعجل القطاف.', alt: 'حبات بن حمراء ناضجة عليها الندى' },
  },
  {
    id: 'harvest',
    image: `${base}images/scene-3.png`,
    fallback: 'linear-gradient(180deg,#3a5230 0%,#8a6a3a 70%,#d19a52 100%)',
    en: { title: 'Picked by hand', text: 'Farmers return to the same trees again and again, taking only what is ready.', alt: 'Hands picking coffee cherries into a basket' },
    ar: { title: 'قطافٌ باليد', text: 'يعود المزارعون إلى الأشجار نفسها مرة بعد مرة، ولا يقطفون إلا الناضج.', alt: 'أيدٍ تقطف حبات البن في سلة' },
  },
  {
    id: 'drying',
    image: `${base}images/scene-4.png`,
    fallback: 'linear-gradient(180deg,#6b5233 0%,#b98440 60%,#e6b866 100%)',
    en: { title: 'Dried in the sun', text: 'Spread on raised beds, the cherries rest in the sun until they are dry.', alt: 'Coffee cherries drying on wooden beds' },
    ar: { title: 'تجفيفٌ تحت الشمس', text: 'تُفرش الثمار على مصاطب مرتفعة وتبقى تحت الشمس حتى تجف.', alt: 'ثمار البن تجف على مصاطب خشبية' },
  },
  {
    id: 'roast',
    image: `${base}images/scene-5.png`,
    fallback: 'linear-gradient(180deg,#140a05 0%,#5a2a10 60%,#d2742a 100%)',
    en: { title: 'Roasted over fire', text: 'A flat pan, an open fire and a steady hand. Saudi coffee is roasted light and golden.', alt: 'Coffee beans roasting in a flat pan over an open fire' },
    ar: { title: 'تحميصٌ على النار', text: 'محماسٌ مسطّح ونار مكشوفة ويد ثابتة. تُحمَّص القهوة السعودية خفيفةً بلونٍ ذهبي.', alt: 'حبات البن تُحمَّص في محماس مسطّح فوق نار مكشوفة' },
  },
  {
    id: 'spice',
    image: `${base}images/scene-6.png`,
    fallback: 'linear-gradient(180deg,#1b110a 0%,#4a3420 55%,#8c6a2f 100%)',
    en: { title: 'Cardamom and spice', text: 'The beans are pounded in a brass mortar, then joined by cardamom, with saffron or cloves in many households.', alt: 'Brass mortar with coffee, cardamom, saffron and cloves' },
    ar: { title: 'الهيل والتوابل', text: 'تُدَقّ الحبوب في هاون نحاسي ثم يُضاف إليها الهيل، ويضيف كثيرٌ من البيوت الزعفران أو القرنفل.', alt: 'هاون نحاسي مع القهوة والهيل والزعفران والقرنفل' },
  },
  {
    id: 'dallah',
    image: `${base}images/scene-7.png`,
    fallback: 'linear-gradient(180deg,#120a06 0%,#3d2110 55%,#b5651f 100%)',
    en: { title: 'The dallah', text: 'Brewed slowly on the coals in the brass dallah, the pot that sits at the heart of every majlis.', alt: 'Brass dallah on glowing coals with rising steam' },
    ar: { title: 'الدلّة', text: 'تُغلى على مهلٍ فوق الجمر في الدلّة النحاسية، قلبِ كل مجلس.', alt: 'دلّة نحاسية على الجمر يتصاعد منها البخار' },
  },
  {
    id: 'cup',
    image: `${base}images/scene-8.png`,
    fallback: 'linear-gradient(180deg,#2a1a0e 0%,#7b5128 55%,#e3b365 100%)',
    en: { title: 'A cup of welcome', text: 'Poured in small measures, with dates alongside. In Saudi Arabia, coffee is how you say welcome.', alt: 'Coffee poured from a dallah into a small cup beside dates' },
    ar: { title: 'فنجانُ الضيافة', text: 'يُصبّ بمقادير صغيرة ومعه التمر. في السعودية، القهوة هي طريقة الترحيب.', alt: 'قهوة تُصبّ من الدلّة في فنجان صغير بجانب التمر' },
  },
];
