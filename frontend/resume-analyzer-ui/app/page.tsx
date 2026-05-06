"use client";

import { useState } from "react";

type AnalysisResult = {
  similarityScore?: number;
  analysis?: {
    score?: number;
    missingSkills?: string[];
    strengths?: string[];
    suggestions?: string[];
  };
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getScoreColor = (score?: number) => {
    if (score === undefined) return "text-gray-400";
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-yellow-500";
    return "text-green-500";
  };

  const handleSubmit = async () => {
    try {
      if (!file || !jobDescription.trim()) {
        alert("Please upload a resume and enter a job description");
        return;
      }

      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Resume/analyze-file`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const text = await res.text(); // 👈 NOT json()
        throw new Error(text);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

 return (
   <div className="min-h-screen bg-gray-100 py-10 px-4">
     <div className="max-w-4xl mx-auto">
       {/* Header */}
       <div className="text-center mb-8">
         <h1 className="text-4xl font-bold text-gray-900">SkillScan AI</h1>
         <p className="text-gray-500 mt-2">
           AI-powered resume analysis with semantic matching
         </p>
         <p className="text-gray-400 mt-2 text-sm">
           Upload your resume and analyze it against a job description 🚀
         </p>
       </div>

       {/* Input Card */}
       <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
         {/* Upload Resume */}
         <div className="mb-5">
           <label
             htmlFor="resume-upload"
             className="block font-medium mb-2 text-gray-700"
           >
             Upload Resume
           </label>

           <input
             id="resume-upload"
             type="file"
             onChange={(e) => setFile(e.target.files?.[0] || null)}
             className="block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:text-sm file:font-medium
             file:bg-blue-50 file:text-blue-600
             hover:file:bg-blue-100
             cursor-pointer"
           />
           {file && (
             <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>
           )}
         </div>

         {/* Job Description */}
         <div className="mb-5">
           <label className="block font-medium mb-2 text-gray-700">
             Job Description
           </label>
           <textarea
             id="job-description"
             value={jobDescription}
             onChange={(e) => setJobDescription(e.target.value)}
             placeholder="Paste job description here..."
             className="w-full border border-gray-300 rounded-xl p-4 h-44 bg-white text-gray-800 placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             transition duration-200 shadow-sm"
           />
         </div>

         {/* Button */}
         <div className="flex justify-center">
           <button
             onClick={handleSubmit}
             disabled={loading}
             className={`px-8 py-3 rounded-xl text-white font-semibold text-lg
    transition-all duration-300 shadow-md
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
    }`}
           >
             {loading ? "Analyzing..." : "Analyze"}
           </button>
         </div>

         {/* Error */}
         {error && <p className="text-red-500 text-center mt-4">{error}</p>}
       </div>

       {/* Results */}
       {result && (
         <div className="mt-8 transition-all duration-500 ease-in-out animate-fade-in">
           <h2 className="text-2xl font-bold mb-4">Results</h2>

           {/* Scores */}
           <div className="grid md:grid-cols-2 gap-4 mb-6">
             {/* Similarity */}
             <div className="bg-white shadow-md rounded-xl p-5 border text-gray-800">
               <p className="text-gray-500 mb-2">Similarity Score</p>

               <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                 <div
                   className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-500"
                   style={{
                     width: `${(result.similarityScore ?? 0) * 100}%`,
                   }}
                 />
               </div>

               <p className="font-semibold">
                 {result.similarityScore !== undefined
                   ? result.similarityScore.toFixed(2)
                   : "N/A"}
               </p>
             </div>

             {/* Match Score */}
             <div className="bg-white shadow-md rounded-xl p-5 border text-gray-800">
               <p className="text-gray-500 mb-2">Match Score</p>

               <p
                 className={`text-4xl font-bold ${
                   result.analysis?.score === undefined
                     ? "text-gray-400"
                     : result.analysis.score < 50
                       ? "text-red-500"
                       : result.analysis.score < 75
                         ? "text-yellow-500"
                         : "text-green-500"
                 }`}
               >
                 {result.analysis?.score ?? "N/A"}
               </p>
             </div>
           </div>

           {/* Missing Skills */}
           <div className="bg-white shadow-md rounded-xl p-5 border text-gray-800">
             <h3 className="text-lg font-semibold mb-3 text-gray-900">
               ⚠️ Missing Skills
             </h3>

             {result.analysis?.missingSkills?.length ? (
               <ul className="space-y-2">
                 {result.analysis.missingSkills.map((skill, i) => (
                   <li
                     key={i}
                     className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm"
                   >
                     ❌ {skill}
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-green-600 font-medium">
                 ✅ No major gaps detected
               </p>
             )}
           </div>

           {/* Strengths */}
           <div className="bg-white shadow-md rounded-xl p-5 border text-gray-800">
             <h3 className="text-lg font-semibold mb-3 text-gray-900">
               💪 Strengths
             </h3>

             <ul className="space-y-2">
               {result.analysis?.strengths?.map((s, i) => (
                 <li
                   key={i}
                   className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm"
                 >
                   ✅ {s}
                 </li>
               ))}
             </ul>
           </div>

           {/* Suggestions */}
           <div className="bg-white shadow-md rounded-xl p-5 border text-gray-800">
             <h3 className="text-lg font-semibold mb-3 text-gray-900">
               🚀 Suggestions
             </h3>

             <ul className="space-y-2">
               {result.analysis?.suggestions?.map((s, i) => (
                 <li
                   key={i}
                   className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
                 >
                   👉 {s}
                 </li>
               ))}
             </ul>
           </div>
         </div>
       )}
     </div>
   </div>
 );
};