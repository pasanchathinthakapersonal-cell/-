import React, { useState, useEffect } from "react";
import { ViabilityDetails, BusinessReport } from "../types";
import { Sparkles, TrendingUp, Compass, Activity, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface IdeaViabilityAssessmentProps {
  report: BusinessReport;
  onUpdateReportScore: (newScores: { marketFit: number; executionContext: number; scalability: number }) => void;
}

export const IdeaViabilityAssessment: React.FC<IdeaViabilityAssessmentProps> = ({
  report,
  onUpdateReportScore,
}) => {
  // Use local state to handle interactive slider values before committing
  const [marketFitVal, setMarketFitVal] = useState(report.viabilityDetails.marketFit.score);
  const [executionVal, setExecutionVal] = useState(report.viabilityDetails.executionContext.score);
  const [scaleVal, setScaleVal] = useState(report.viabilityDetails.scalability.score);

  // Sync state with incoming report
  useEffect(() => {
    setMarketFitVal(report.viabilityDetails.marketFit.score);
    setExecutionVal(report.viabilityDetails.executionContext.score);
    setScaleVal(report.viabilityDetails.scalability.score);
  }, [report]);

  // Real-time calculated overall score based on the three components
  const calculatedOverallScore = Math.round((marketFitVal + executionVal + scaleVal) / 3);

  // Trigger updating report on the parent when values change
  const handleSliderChange = (type: 'market' | 'execution' | 'scalability', val: number) => {
    let updatedMarket = marketFitVal;
    let updatedExec = executionVal;
    let updatedScale = scaleVal;

    if (type === 'market') {
      setMarketFitVal(val);
      updatedMarket = val;
    } else if (type === 'execution') {
      setExecutionVal(val);
      updatedExec = val;
    } else {
      setScaleVal(val);
      updatedScale = val;
    }

    onUpdateReportScore({
      marketFit: updatedMarket,
      executionContext: updatedExec,
      scalability: updatedScale,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-cyber-primary border-cyber-primary/30";
    if (score >= 50) return "text-cyber-tertiary border-cyber-tertiary/30";
    return "text-red-400 border-red-500/30";
  };

  const getOverallLabel = (score: number) => {
    if (score >= 85) return { status: "EXCEPTIONAL PATHWAY", desc: "Your concept matches intense market signals and displays massive scalability leverage." };
    if (score >= 70) return { status: "VIABLE INITIATIVE", desc: "Healthy market fundamentals. Minor alignment adjustments on unit logistics required." };
    if (score >= 50) return { status: "OPERATIONAL RISK", desc: "Complex execution roadblocks limit scale potential. Refine prototype mechanics with Cyril." };
    return { status: "CONCEPT CRITICAL", desc: "High competitive saturation or operational costs. Shift core delivery before building." };
  };

  const overallRating = getOverallLabel(calculatedOverallScore);

  const chartData = [
    { subject: 'Market Fit', score: marketFitVal, fullMark: 100 },
    { subject: 'Execution', score: executionVal, fullMark: 100 },
    { subject: 'Scalability', score: scaleVal, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 rounded-xl bg-cyber-card/80 border border-cyber-bright/35 h-full">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-cyber-bright/20 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyber-primary" />
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-white">
            Viability Diagnostics
          </h3>
        </div>
        <span className="text-[10px] bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          LIVE SCORING
        </span>
      </div>

      {/* Main Overall Meter Indicator */}
      <div className="flex items-center gap-6 p-5 rounded-xl bg-black/40 border border-cyber-bright/30">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="#1f222a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Viability"
                dataKey="score"
                stroke="#00ff9d"
                fill="#00ff9d"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-display font-bold text-white leading-none">
              {calculatedOverallScore}
            </span>
            <span className="text-[10px] font-label uppercase text-cyber-muted tracking-widest pb-1">
              Viability Score
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold tracking-wider text-cyber-tertiary block mt-2">
            {overallRating.status}
          </span>
          <p className="text-sm font-display text-white font-medium mt-1">
            Overall Investment Fit Analysis
          </p>
          <p className="text-xs text-cyber-muted leading-relaxed mt-1.5 font-light">
            {overallRating.desc}
          </p>
        </div>
      </div>

      {/* Sliders and Qualitative analysis tabs */}
      <div className="flex-1 space-y-5">
        <h4 className="text-xs font-label uppercase tracking-widest text-cyber-muted flex items-center gap-1.5 border-b border-cyber-bright/10 pb-2">
          <Activity className="w-3.5 h-3.5 text-cyber-tertiary" />
          <span>Interactive Core Pillars</span>
        </h4>

        {/* Market Fit Metric */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-display font-medium text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyber-primary" />
              Market Fit & Demand forces
            </span>
            <span className={`font-mono font-bold  px-2 py-0.5 rounded border text-[11px] ${getScoreColor(marketFitVal)}`}>
              {marketFitVal} pts
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted font-light leading-relaxed">
            {report.viabilityDetails.marketFit.analysis}
          </p>
          <input
            type="range"
            min="20"
            max="100"
            value={marketFitVal}
            onChange={(e) => handleSliderChange('market', parseInt(e.target.value))}
            className="w-full accent-cyber-primary cursor-pointer mt-1"
          />
        </div>

        {/* Execution Context Metric */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-display font-medium text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyber-tertiary" />
              Execution Complexity & Logistics
            </span>
            <span className={`font-mono font-bold  px-2 py-0.5 rounded border text-[11px] ${getScoreColor(executionVal)}`}>
              {executionVal} pts
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted font-light leading-relaxed">
            {report.viabilityDetails.executionContext.analysis}
          </p>
          <input
            type="range"
            min="20"
            max="100"
            value={executionVal}
            onChange={(e) => handleSliderChange('execution', parseInt(e.target.value))}
            className="w-full accent-cyber-primary cursor-pointer mt-1"
          />
        </div>

        {/* Scalability Metric */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-display font-medium text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Scalability & Value Leverages
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded border text-[11px] ${getScoreColor(scaleVal)}`}>
              {scaleVal} pts
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted font-light leading-relaxed">
            {report.viabilityDetails.scalability.analysis}
          </p>
          <input
            type="range"
            min="20"
            max="100"
            value={scaleVal}
            onChange={(e) => handleSliderChange('scalability', parseInt(e.target.value))}
            className="w-full accent-cyber-primary cursor-pointer mt-1"
          />
        </div>
      </div>
    </div>
  );
};
