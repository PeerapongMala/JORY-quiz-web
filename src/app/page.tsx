"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, RotateCcw } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

const questions = [
  {
    id: 1,
    question: "ถ้าวันนี้ไม่มีอะไรต้องรีบ คุณอยากใช้เวลาอยู่ในบรรยากาศแบบไหนที่สุด",
    options: [
      { value: "A", label: "A. ห้องสะอาด แสงนุ่ม ทุกอย่างดูเรียบและพอดี" },
      { value: "B", label: "B. สถานที่มีสีสัน เสียงหัวเราะ มีของน่ารักให้มอง" },
      { value: "C", label: "C. บ้านหรือที่ที่ให้ความรู้สึกปลอดภัย อบอุ่น" },
      { value: "D", label: "D. ที่ไหนก็ได้ที่อยู่แล้วสบายใจ ไม่ต้องปรับตัว" },
      { value: "E", label: "E. พื้นที่โล่ง อากาศดี มีลมหรือน้ำ" },
    ],
  },
  {
    id: 2,
    question: "คนรอบตัวมักมองคุณเป็นคนแบบไหน",
    options: [
      { value: "A", label: "A. สุภาพ นุ่มนวล มีเสน่ห์" },
      { value: "B", label: "B. ร่าเริง เป็นกันเอง สดใส" },
      { value: "C", label: "C. อบอุ่น เหมือนที่พักใจ" },
      { value: "D", label: "D. เป็นตัวเอง เข้าถึงง่าย" },
      { value: "E", label: "E. สบาย ๆ สดชื่น มีชีวิตชีวา" },
    ],
  },
  {
    id: 3,
    question: "คุณรู้สึกดีกับตัวเองที่สุดในช่วงไหน",
    options: [
      { value: "A", label: "A. ดึก เงียบ ซ่อนความโรแมนติก" },
      { value: "B", label: "B. กลางวัน สดใส" },
      { value: "C", label: "C. เย็น–ค่ำ" },
      { value: "D", label: "D. เช้าแบบสบาย ๆ" },
      { value: "E", label: "E. เช้าตรู่ อากาศโล่ง" },
    ],
  },
  {
    id: 4,
    question: "สำหรับคุณ น้ำหอมควร...",
    options: [
      { value: "A", label: "A. สะท้อนตัวตนที่ละเอียดอ่อน" },
      { value: "B", label: "B. เติมพลังให้วันธรรมดา" },
      { value: "C", label: "C. เป็นเหมือนที่พักใจ" },
      { value: "D", label: "D. อยู่กับคุณได้ทุกวัน" },
      { value: "E", label: "E. ทำให้รู้สึกเบาขึ้น" },
    ],
  },
  {
    id: 5,
    question: "ถ้าต้องเลือกความรู้สึกหนึ่งอย่างให้ติดตัวทั้งวัน",
    options: [
      { value: "A", label: "A. ละเมียด หรูแบบไม่ต้องอธิบาย" },
      { value: "B", label: "B. สนุก สดใส" },
      { value: "C", label: "C. อบอุ่น ปลอดภัย" },
      { value: "D", label: "D. ใส เป็นธรรมชาติ" },
      { value: "E", label: "E. สดชื่น โล่ง" },
    ],
  },
];

type ResultKey = "A" | "B" | "C" | "D" | "E";

const resultsData: Record<
  ResultKey,
  {
    animalTh: string;
    perfumeName: string;
    scent: string;
    description1: string;
    description2: string;
    animalImage: string;
    nameColor: string;
  }
> = {
  A: {
    animalTh: "แมวขาว",
    perfumeName: "Gentle Paws",
    scent: "Soft Clean Elegance",
    description1:
      "คุณมีความสุขุม สงบแต่ในขณะเดียวกันก็มีความน่ารักซ่อนอยู่ คุณมีความเป็นตัวของตัวเองแต่ไม่ได้ต้องการเป็นจุดสนใจเป็นคนที่มีเสน่ห์โดยไม่ต้องอธิบายและมีภาพลักษณ์ที่มีระดับ",
    description2:
      "คุณรักการที่อยู่ในสภาพแวดล้อมที่สงบ ไม่วุ่นวายแต่ก็รักที่จะทำกิจกรรมกลางแจ้ง ดังนั้นจึงเหมาะกับกลิ่น Gentle Paws ที่มีกลิ่นแบบ Soft Luxury ให้ความรู้สึกหรูหรา แต่ก็น่าทะนุถนอมในขณะเดียวกันและยังทำให้บรรยากาศรอบข้างโรแมนติกขึ้นอีกด้วย",
    animalImage: "/assets/animals/cat-uxui.png",
    nameColor: "#FC6189",
  },
  B: {
    animalTh: "กระต่าย",
    perfumeName: "Bunny In The Carrot Patch",
    scent: "Fruity Floral",
    description1:
      "คุณเป็นคนที่มีความสนุกสนาน มีชีวิตชีวา สดใส มีความเป็นกันเองสูงและคุณใช้อารมณ์บวกเป็นสะพานเชื่อมในความสัมพันธ์",
    description2:
      "คุณเป็นคนที่สามารถทำให้วันธรรมดา ๆ เป็นวันที่สนุกได้ ดังนั้นคุณจึงเหมาะกับกลิ่น Bunny In The Carrot Patch ที่มีกลิ่นแบบ Fruity ผสมผสานกับ Floral ที่มอบความรู้สึกสดใสมีชีวิตชีวาเติมเต็มสีสันให้กับบรรยากาศและผู้คนรอบข้างได้เป็นอย่างดี",
    animalImage: "/assets/animals/rabbit-uxui.png",
    nameColor: "#A78BFA",
  },
  C: {
    animalTh: "หมี",
    perfumeName: "Midnight Embrace",
    scent: "Warm Woody Comforting",
    description1:
      "คุณเป็นคนที่อบอุ่น จริงใจ รับฟังผู้อื่นเก่ง ให้คุณค่ากับความสัมพันธ์ที่คุณมี คุณให้ความสำคัญกับความปลอดภัยและความสบายใจ มากกว่าความหวือหวา",
    description2:
      "ดังนั้นคุณจึงเหมาะกับกลิ่น Midnight Embrace ที่ให้ความรู้สึกอบอุ่น เหมือนถูกโอบกอดยามค่ำคืน ทำให้บรรยากาศรอบข้างผ่อนคลาย และอบอุ่น",
    animalImage: "/assets/animals/bear-uxui.png",
    nameColor: "#F59E0B",
  },
  D: {
    animalTh: "หมาเด็ก",
    perfumeName: "Little Puppy",
    scent: "Clean Unisex",
    description1:
      "คุณเป็นคนสบาย ๆ ธรรมดาแต่พิเศษ ชอบความเรียบง่าย ไม่กดดัน คุณมักจะเลือกความสบายใจมากกว่าภาพลักษณ์ ชอบความเป็นธรรมชาติและไม่ซับซ้อน คุณมักอยากจะให้คนรอบตัวเป็นตัวของตัวเองได้",
    description2:
      "ดังนั้นคุณจึงเหมาะกับกลิ่น Little Puppy ที่ให้ความรู้สึกที่ปลอดภัย ไม่ได้โดดเด่นจนเกินไป แต่สบายใจกับทุกบรรยากาศและสถานการณ์",
    animalImage: "/assets/animals/puppy-uxui.png",
    nameColor: "#5EEAD4",
  },
  E: {
    animalTh: "หงส์",
    perfumeName: "Aquarise Swan",
    scent: "Freshy Airy",
    description1:
      "คุณเป็นคนสุงบ สุขุม ให้คุณค่ากับอิสระและพื้นที่ทางอารมณ์ของตัวเอง คุณไม่ชอบความอึดอัด อารมณ์หรืออะไรหนัก ๆ คุณจึงชอบที่จะใช้เวลาในที่ปลอดโปร่ง ที่ให้รู้สึกดีทั้งกายและใจ",
    description2:
      "ดังนั้นคุณจึงเหมาะกับกลิ่น Aquarise Swan ที่ให้ความรู้สึกเบาสบาย ปลอดโปร่ง ทำให้บรรยากาศรอบข้างดูสดชื่นขึ้น",
    animalImage: "/assets/animals/swan-uxui.png",
    nameColor: "#60A5FA",
  },
};

// TODO: Connect to actual DB
async function saveToDatabase(userAnswers: string[], finalResult: ResultKey) {
  console.log("Saving to database:", { userAnswers, finalResult });
}

function calculateResult(answers: string[]): ResultKey {
  const counts: Record<string, number> = {};
  for (const answer of answers) {
    counts[answer] = (counts[answer] || 0) + 1;
  }
  let maxCount = 0;
  let result: ResultKey = "A";
  for (const key of ["A", "B", "C", "D", "E"] as ResultKey[]) {
    if ((counts[key] || 0) > maxCount) {
      maxCount = counts[key] || 0;
      result = key;
    }
  }
  return result;
}

type Screen = "start" | "quiz" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ResultKey | null>(null);
  const [direction, setDirection] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswer = useCallback(
    async (value: string) => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setDirection(1);
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const finalResult = calculateResult(newAnswers);
        setResult(finalResult);
        await saveToDatabase(newAnswers, finalResult);
        setScreen("result");
      }
    },
    [answers, currentQuestion]
  );

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#FFF8DC",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "jory-quiz-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  };

  const handlePlayAgain = () => {
    setScreen("start");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden bg-[#FFF8DC]">
      <AnimatePresence mode="wait">
        {/* ==================== LANDING PAGE ==================== */}
        {screen === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-8"
          >
            {/* What's ?? your Journey */}
            <div className="flex flex-col items-center gap-0 mb-2">
              <div className="flex items-start gap-1">
                <Image
                  src="/assets/ui/whats.png"
                  alt="What's"
                  width={150}
                  height={37}
                  className="mt-1"
                />
                <Image
                  src="/assets/ui/question-yellow.png"
                  alt="?"
                  width={34}
                  height={41}
                />
                <Image
                  src="/assets/ui/question-pink.png"
                  alt="?"
                  width={31}
                  height={31}
                  className="mt-2"
                />
              </div>
              <div className="flex items-baseline gap-2 -mt-1">
                <Image
                  src="/assets/ui/your_landing.png"
                  alt="your"
                  width={109}
                  height={36}
                />
                <Image
                  src="/assets/ui/Journey.png"
                  alt="Journey"
                  width={223}
                  height={51}
                />
              </div>
            </div>

            {/* Keychain Products with yellow flower background */}
            <div className="relative w-full flex justify-center my-4">
              <Image
                src="/assets/ui/flower.png"
                alt=""
                width={280}
                height={280}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90"
              />
              <div className="relative flex items-end justify-center gap-0 z-10">
                <Image
                  src="/assets/ui/Rectangle-4.png"
                  alt="Rabbit"
                  width={70}
                  height={180}
                  className="object-contain -mr-1"
                />
                <Image
                  src="/assets/ui/Rectangle-2.png"
                  alt="Bear"
                  width={75}
                  height={170}
                  className="object-contain -mr-1"
                />
                <Image
                  src="/assets/ui/Rectangle-1.png"
                  alt="Cat"
                  width={72}
                  height={185}
                  className="object-contain -mr-1"
                />
                <Image
                  src="/assets/ui/Rectangle.png"
                  alt="Puppy"
                  width={78}
                  height={180}
                  className="object-contain -mr-1"
                />
                <Image
                  src="/assets/ui/Rectangle-3.png"
                  alt="Swan"
                  width={65}
                  height={165}
                  className="object-contain"
                />
              </div>
            </div>

            {/* match yourself with Jory */}
            <Image
              src="/assets/ui/Group 1.png"
              alt="match yourself with Jory"
              width={199}
              height={178}
              className="my-2"
            />

            {/* Subtitle */}
            <p className="text-center text-[#FC6189] font-[family-name:var(--font-poppins)] text-base leading-relaxed mt-1 mb-4">
              ค้นหากลิ่นน้ำหอมและสัตว์ประจำตัว
              <br />
              ที่บ่งบอกความเป็นคุณได้ดีที่สุด
            </p>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-[family-name:var(--font-poppins)] font-medium text-sm py-2.5 px-10 rounded-full shadow-sm transition-colors"
            >
              start
            </motion.button>
          </motion.div>
        )}

        {/* ==================== QUIZ PAGE ==================== */}
        {screen === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen px-5 py-6"
          >
            {/* Jory Logo at top */}
            <div className="flex justify-center mb-5">
              <Image
                src="/assets/logos/jory-text.png"
                alt="JORY"
                width={120}
                height={80}
              />
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestion}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col gap-4"
                >
                  {/* Question in pink rounded bar */}
                  <div className="bg-pink-400 rounded-2xl py-3 px-5 mb-2 shadow-sm min-h-[60px] flex items-center justify-center">
                    <h2 className="font-[family-name:var(--font-poppins)] text-sm font-medium text-white leading-relaxed text-center">
                      {questions[currentQuestion].question}
                    </h2>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-3">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full bg-pink-300 hover:bg-pink-400 text-white font-[family-name:var(--font-poppins)] text-sm py-3 px-5 rounded-full shadow-sm transition-colors text-center leading-snug"
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 pt-4 pb-2">
              <motion.button
                whileHover={currentQuestion > 0 ? { scale: 1.1 } : {}}
                whileTap={currentQuestion > 0 ? { scale: 0.9 } : {}}
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentQuestion === 0
                    ? "text-gray-300 bg-transparent opacity-40"
                    : "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                }`}
              >
                <ChevronLeft size={22} />
              </motion.button>
              <div className="bg-yellow-400 text-white font-[family-name:var(--font-poppins)] font-bold text-sm w-11 h-11 rounded-full flex items-center justify-center shadow-md">
                {currentQuestion + 1}
              </div>
              <motion.button
                whileHover={currentQuestion < questions.length - 1 ? { scale: 1.1 } : {}}
                whileTap={currentQuestion < questions.length - 1 ? { scale: 0.9 } : {}}
                onClick={() => {
                  setShowAlert(true);
                  setTimeout(() => setShowAlert(false), 2000);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentQuestion === questions.length - 1
                    ? "text-gray-300 bg-transparent opacity-40"
                    : "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                }`}
              >
                <ChevronRight size={22} />
              </motion.button>
            </div>

            {/* Alert message */}
            <AnimatePresence>
              {showAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-center font-[family-name:var(--font-poppins)] text-xs text-pink-500 bg-pink-50 rounded-full py-1.5 px-4 mx-auto shadow-sm"
                >
                  กรุณาเลือกคำตอบก่อนไปข้อถัดไป
                </motion.div>
              )}
            </AnimatePresence>

            {/* Home button */}
            <div className="flex justify-center pt-3 pb-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAgain}
                className="border-2 border-amber-700/30 text-amber-700/70 hover:bg-amber-700/10 font-[family-name:var(--font-poppins)] font-medium text-sm py-2 px-10 rounded-full transition-colors"
              >
                home
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ==================== RESULT PAGE ==================== */}
        {screen === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center min-h-screen px-5 pt-2 pb-6"
          >
            <div
              ref={resultRef}
              className="w-full bg-[#FFF8DC] flex flex-col items-center gap-2 pb-6 px-4"
            >
              {/* Your RESULT! header */}
              <div className="flex flex-col items-start self-start mb-1">
                <Image
                  src="/assets/ui/your_result.png"
                  alt="Your"
                  width={132}
                  height={35}
                />
                <Image
                  src="/assets/ui/result-text.png"
                  alt="RESULT!"
                  width={203}
                  height={37}
                  className="-mt-1"
                />
              </div>

              {/* Animal image with flower background (from UXUI) */}
              <div className="relative w-56 h-56 my-2">
                <Image
                  src={resultsData[result].animalImage}
                  alt={resultsData[result].animalTh}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {/* "you are" text */}
              <Image
                src="/assets/ui/your are.png"
                alt="you are"
                width={160}
                height={34}
                className="mt-2"
              />

              {/* Animal name */}
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mt-1" style={{ color: resultsData[result].nameColor }}>
                &ldquo;{resultsData[result].animalTh}&rdquo;
              </h2>

              {/* Perfume name */}
              <p className="font-[family-name:var(--font-playfair)] font-bold text-lg italic leading-tight text-center" style={{ color: resultsData[result].nameColor }}>
                {resultsData[result].perfumeName}
              </p>

              {/* Scent type */}
              <p className="font-[family-name:var(--font-poppins)] text-xs italic" style={{ color: resultsData[result].nameColor }}>
                &ldquo; {resultsData[result].scent} &rdquo;
              </p>

              {/* Description paragraphs */}
              <div className="text-center mt-4 space-y-4 px-2">
                <p className="font-[family-name:var(--font-poppins)] text-[#4877AF] text-sm leading-relaxed font-bold">
                  คุณคือ {resultsData[result].animalTh} เหมาะกับ{" "}
                  {resultsData[result].perfumeName}
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-[#4877AF] text-sm leading-loose">
                  {resultsData[result].description1}
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-[#4877AF] text-sm leading-loose">
                  {resultsData[result].description2}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full mt-6 mb-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveImage}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-[family-name:var(--font-poppins)] font-semibold py-3 rounded-full shadow-lg flex items-center justify-center gap-2"
              >
                <Download size={18} />
                บันทึกผลลัพธ์
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAgain}
                className="self-start bg-teal-600 hover:bg-teal-700 text-white font-[family-name:var(--font-poppins)] font-medium text-xs py-2 px-5 rounded-full flex items-center gap-1 shadow-sm transition-colors"
              >
                <ChevronLeft size={14} />
                Back
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
