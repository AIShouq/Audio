
import React, { useState, useEffect, useRef } from 'react';
import { voiceService } from './services/VoiceService';
import PoseAnalyzer from './components/PoseAnalyzer';

const App: React.FC = () => {
  const [workoutActive, setWorkoutActive] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('اضغط على "ابدأ التمرين" لسماع الشرح الصوتي.');
  
  const INSTRUCTIONS = `
    هلا بك في آوديو فيت. تمريننا اليوم هو الباي سيبس كيرل.
    أولاً: وضعية الوقوف. خلك واقف مستقيم، مفرود الظهر، وبعّد رجولك عن بعض شوي للتوازن.
    ثانياً: الإمساك بالوزن. خل يدك جنبك وكف اليد يطالع قدام.
    ثالثاً: الحركة. ارفع الوزن لكتفك ببطء، وكوعك خله لاصق بجسمك تماماً ولا يتحرك لا قدام ولا ورا.
    رابعاً: التنفس. طلع النفس وأنت ترفع الوزن، وخذ شهيق وأنت تنزله ببطء.
    انتبه لا تمايل بظهرك. الحين ببدأ أراقب حركتك، بالتوفيق!
  `;

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 's') toggleWorkout();
      if (key === 'r') repeatInstructions();
      if (key === 'c') toggleCamera();
      if (key === 'escape') panicStop();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workoutActive, cameraOn]);

  const toggleCamera = () => {
    const newState = !cameraOn;
    setCameraOn(newState);
    voiceService.speak(newState ? "تم تشغيل الكاميرا." : "تم إيقاف الكاميرا.");
  };

  const toggleWorkout = () => {
    if (!workoutActive) {
      setWorkoutActive(true);
      setRepCount(0);
      setFeedbackText("بدأ التمرين.. استمع جيداً");
      voiceService.speak(INSTRUCTIONS);
      if (!cameraOn) setCameraOn(true);
    } else {
      setWorkoutActive(false);
      setFeedbackText("انتهى التمرين.");
      voiceService.speak(`يعطيك العافية، سويت ${repCount} عدات بطلة. وقفنا الحين.`);
    }
  };

  const repeatInstructions = () => {
    if (workoutActive) {
      voiceService.speak(INSTRUCTIONS, 'high');
    }
  };

  const panicStop = () => {
    voiceService.stopAll();
    setWorkoutActive(false);
  };

  const handleRepCount = (count: number) => {
    setRepCount(count);
  };

  const handleFeedback = (msg: string) => {
    setFeedbackText(msg);
  };

  const speakOnFocus = (text: string) => {
    voiceService.speak(text, 'normal');
  };

  return (
    <>
      <a className="skip-link" href="#main">تخطي إلى المحتوى</a>

      <header className="header" role="banner">
        <div className="brand">
          <img className="logo" src="AudioFitLogo.jpg" alt="شعار AudioFit يظهر شخص كفيف يتدرب" />
          <div className="brand-text">
            <h1 className="title">AudioFit</h1>
            <p className="subtitle">مدرب افتراضي يعتمد على التوجيه الصوتي</p>
          </div>
        </div>

        <div className="status" aria-label="حالة النظام">
          <span className="pill" id="workoutStatus" aria-live="polite">
            التمرين: {workoutActive ? 'نشط' : 'غير نشط'}
          </span>
          <span className="pill" id="cameraStatus" aria-live="polite">
            الكاميرا: {cameraOn ? 'تعمل' : 'متوقفة'}
          </span>
          <span className="pill" id="speechStatus" aria-live="polite">
            الصوت: جاهز
          </span>
        </div>
      </header>

      <main id="main" className="container" role="main">
        <section className="card" aria-labelledby="aboutTitle">
          <h2 id="aboutTitle">كيف يساعدك AudioFit؟</h2>
          <ul className="list">
            <li>شرح تمرين Bicep Curl خطوة بخطوة بصوت سعودي واضح.</li>
            <li>تنبيهات تصحيحية ذكية باستخدام الذكاء الاصطناعي.</li>
            <li>دعم كامل لقارئات الشاشة واختصارات لوحة المفاتيح.</li>
          </ul>
        </section>

        <section className="card" aria-labelledby="controlTitle">
          <h2 id="controlTitle">لوحة التحكم</h2>
          <div className="control-panel" role="group" aria-label="أزرار التحكم">
            <button 
              id="workoutToggleBtn" 
              className="btn btn-main" 
              type="button" 
              onClick={toggleWorkout}
              onFocus={() => speakOnFocus(workoutActive ? "إيقاف التمرين" : "بدء التمرين")}
            >
              {workoutActive ? 'إيقاف التمرين' : 'ابدأ التمرين'}
            </button>

            <button 
              id="repeatBtn" 
              className="btn btn-main" 
              type="button" 
              disabled={!workoutActive}
              onClick={repeatInstructions}
              onFocus={() => speakOnFocus("إعادة التعليمات الصوتية")}
            >
              إعادة التعليمات
            </button>

            <button 
              id="cameraToggleBtn" 
              className="btn btn-main" 
              type="button"
              onClick={toggleCamera}
              onFocus={() => speakOnFocus(cameraOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا")}
            >
              {cameraOn ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
            </button>

            <button 
              id="panicBtn" 
              className="btn btn-danger" 
              type="button"
              onClick={panicStop}
              onFocus={() => speakOnFocus("إيقاف جميع الأصوات فوراً")}
            >
              إيقاف الصوت فورًا
            </button>
          </div>

          <p className="hint" id="keysHint">
            اختصارات: S بدء/إيقاف، R إعادة التعليمات، C الكاميرا، Esc إيقاف الصوت.
          </p>
        </section>

        <section className="card" aria-labelledby="coachTitle">
          <h2 id="coachTitle">التوجيه الصوتي</h2>
          <div className="panel single">
            <h3 className="panel-title">التوجيهات والعدات</h3>
            <div id="alertText" className="panel-body alert" tabIndex={0} aria-live="assertive">
              {workoutActive ? (
                <div className="flex flex-col items-center">
                  <span className="text-sm opacity-70">عدد العدات: {repCount}</span>
                  <span className="mt-2">{feedbackText}</span>
                </div>
              ) : feedbackText}
            </div>
          </div>
        </section>

        <section className="card" aria-labelledby="cameraTitle">
          <h2 id="cameraTitle">تحليل الوضعية</h2>
          <div className="media-wrap">
             {cameraOn ? (
               <PoseAnalyzer 
                 isActive={workoutActive} 
                 onRepCount={handleRepCount}
                 onFeedback={handleFeedback}
               />
             ) : (
               <div className="flex items-center justify-center h-full text-white/50 bg-black/80">
                 الكاميرا متوقفة. اضغط "تشغيل الكاميرا" للمراقبة.
               </div>
             )}
          </div>
          <p className="hint">الكاميرا تُستخدم لمراقبة وضعية الكوع ومسار حركة اليد لضمان سلامتك.</p>
        </section>

        <section className="card" aria-labelledby="videoTitle">
          <h2 id="videoTitle">فيديو مرجعي للتكنيك</h2>
          <div className="media-wrap">
            <video id="refVideo" className="media" controls preload="metadata">
              <source src="BicepCurl.mp4" type="video/mp4" />
              متصفحك لا يدعم عرض الفيديو.
            </video>
          </div>
          <p className="hint">
            الفيديو للمرجعية البصرية فقط؛ اعتمد كلياً على التوجيه الصوتي للتدريب.
          </p>
        </section>
      </main>
    </>
  );
};

export default App;
