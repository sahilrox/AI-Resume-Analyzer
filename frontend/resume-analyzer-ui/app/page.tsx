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

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-2">AI Resume Analyzer 🚀</h1>

        <p className="text-gray-600 mb-6">
          Upload your resume and compare it against a job description using AI +
          semantic matching.
        </p>

        {/* Upload */}
        <label className="block mb-2 font-medium">Upload Resume</label>
        <div className="mb-4">
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded inline-block">
            Choose File
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {file && (
            <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
          )}
        </div>

        {/* JD */}
        <label className="block mb-2 font-medium">Job Description</label>
        <textarea
          placeholder="Paste job description here..."
          className="w-full p-3 border rounded mb-4"
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Results</h2>

            {/* SCORE CARDS */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Similarity */}
              <div className="bg-white rounded-xl shadow p-5">
                <p className="text-gray-500 mb-2">Similarity Score</p>

                <div className="w-full bg-gray-200 rounded h-4 mb-2 overflow-hidden">
                  <div
                    className={`h-4 rounded transition-all duration-500 ${
                      (result.similarityScore ?? 0) > 0.75
                        ? "bg-green-500"
                        : (result.similarityScore ?? 0) > 0.5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${(result.similarityScore ?? 0) * 100}%`,
                    }}
                  />
                </div>

                <p className="text-lg font-semibold">
                  {(result.similarityScore ?? 0).toFixed(2)}
                </p>
              </div>

              {/* Match Score */}
              <div className="bg-white rounded-xl shadow p-5 flex flex-col justify-center items-center">
                <p className="text-gray-500 mb-2">Match Score</p>
                <p className="text-4xl font-bold text-blue-600">
                  {result.analysis?.score ?? "N/A"}
                </p>
              </div>
            </div>

            {/* DETAILS CARDS */}
            <div className="grid gap-6">
              {/* Missing Skills */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-3">Missing Skills</h3>
                {result.analysis?.missingSkills?.length ? (
                  <ul className="list-disc ml-5 text-gray-700">
                    {result.analysis.missingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No major gaps detected 🎯</p>
                )}
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-3">Strengths</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {result.analysis?.strengths?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {result.analysis?.suggestions?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
