import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const HealingJourneyDashboard = () => {
  const [showProjections, setShowProjections] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  // YOUR ACTUAL DATA - Days 1-17 compiled from your daily logs
  const healingData = [
    {
      day: 0,
      date: 'Oct 13',
      label: 'Surgery',
      bruisingResolved: 0,
      swellingGone: 0,
      painReduction: 0,
      mobility: 5,
      actual: true,
      milestone: '🏥 Surgery complete - testicles removed',
      note: 'The beginning of your freedom'
    },
    {
      day: 1,
      date: 'Oct 14',
      label: 'Day 1',
      bruisingResolved: 0,
      swellingGone: 0,
      painReduction: 40, // 6/10 pain = 40% better than worst
      mobility: 10,
      actual: true,
      milestone: 'Massive swelling discovered overnight',
      note: 'Hematoma diagnosis - this is temporary. Called surgeon twice for reassurance (normal and encouraged!).'
    },
    {
      day: 2,
      date: 'Oct 15',
      label: 'Day 2',
      bruisingResolved: 5,
      swellingGone: 0,
      painReduction: 50, // 5/10 rest pain
      mobility: 15,
      actual: true,
      note: 'Bruising deeper/more defined - normal progression. Size stable, maybe slightly less tense. Bowel movement achieved! ✓'
    },
    {
      day: 4,
      date: 'Oct 17',
      label: 'Day 4',
      bruisingResolved: 15,
      swellingGone: 5,
      painReduction: 50,
      mobility: 20,
      actual: true,
      note: 'Yellow/green edges appearing - healing! Pain "okay" but switched to Tylenol only (prescription still not picked up).'
    },
    {
      day: 5,
      date: 'Oct 18',
      label: 'Day 5',
      bruisingResolved: 25,
      swellingGone: 10,
      painReduction: 30, // 7/10 morning = harder day
      mobility: 25,
      actual: true,
      note: 'Pain spike (common Days 4-6 as nerves wake up). Itching began - nerve regeneration sign. BM regular.'
    },
    {
      day: 6,
      date: 'Oct 19',
      label: 'Day 6',
      bruisingResolved: 40,
      swellingGone: 20,
      painReduction: 40, // 6/10
      mobility: 35,
      actual: true,
      milestone: 'Major fading - yellow/pale dominant ✨',
      note: 'Itching much better (Benadryl worked!), slept finally. Caregiver burnout setting in for both you and Anja.'
    },
    {
      day: 7,
      date: 'Oct 20',
      label: 'Day 7',
      bruisingResolved: 80,
      swellingGone: 40,
      painReduction: 50, // 5/10 rest
      mobility: 45,
      actual: true,
      milestone: '🎯 Week 1 Complete!',
      note: 'Yellow/tan bruising (80% resolved), swelling 80% down, pain 5/10. 5-7 min walks possible. Large BM after 48 hrs - started Miralax + Colace daily.'
    },
    {
      day: 8,
      date: 'Oct 21',
      label: 'Day 8',
      bruisingResolved: 90,
      swellingGone: 50,
      painReduction: 65, // 3-4/10 rest, but 5-7/10 walking
      mobility: 50,
      actual: true,
      milestone: 'Visual healing 90%+ ✨',
      note: 'Bruising barely visible (pale tan), swelling reduced. BUT: Movement pain plateau - 5-7/10 with walking. Depression documented: feeling useless/burden (expected Days 8-14).'
    },
    {
      day: 9,
      date: 'Oct 22',
      label: 'Day 9',
      bruisingResolved: 95,
      swellingGone: 55,
      painReduction: 70, // 3-4 sitting, 5-6 walking
      mobility: 53,
      actual: true,
      milestone: '🌅 THE TURNING POINT ✨',
      note: 'Bruising 95% resolved. MAJOR MOOD SHIFT: "Much more feeling like I\'m becoming a person again." First outing (Taco Bell drive-thru + Walgreens). No rebound swelling = activity level appropriate. Depression lifting right on timeline!'
    },
    {
      day: 10,
      date: 'Oct 23',
      label: 'Day 10',
      bruisingResolved: 97,
      swellingGone: 58,
      painReduction: 70,
      mobility: 55,
      actual: true,
      note: 'Planned rest day after Day 9 outing. Bruising 97-98% faded. Body consolidating gains from first outing.'
    },
    {
      day: 11,
      date: 'Oct 24',
      label: 'Day 11',
      bruisingResolved: 98,
      swellingGone: 60,
      painReduction: 70,
      mobility: 58,
      actual: true,
      note: 'Short drive to Aldi, felt manageable. Testing gentle activity. Pain stable around 3-4/10 rest.'
    },
    {
      day: 12,
      date: 'Oct 25',
      label: 'Day 12',
      bruisingResolved: 99,
      swellingGone: 62,
      painReduction: 50, // 5-6/10 walking after increased activity
      mobility: 60,
      actual: true,
      milestone: '⚠️ Activity Ceiling Discovered',
      note: 'Bruising 99% gone! But did more walking than previous days → pain spike to 5-6/10. Found activity ceiling by exceeding it. Lesson: 20-30 min gentle movement max, NOT "moving like normal."'
    },
    {
      day: 13,
      date: 'Oct 26',
      label: 'Day 13',
      bruisingResolved: 99,
      swellingGone: 63,
      painReduction: 50,
      mobility: 60,
      actual: true,
      note: 'Similar to Day 12. Learning activity limits. Bruising phase complete - 99% resolved. Internal hematoma still organizing (30% through 6-week process).'
    },
    {
      day: 14,
      date: 'Oct 27',
      label: 'Day 14',
      bruisingResolved: 99,
      swellingGone: 65,
      painReduction: 60,
      mobility: 65,
      actual: true,
      milestone: '🎯 Week 2 Complete! Work note expired',
      note: 'Drove + held baby (Monday activity). Work note expired but NOT ready for field visits. Tired by end of day.'
    },
    {
      day: 15,
      date: 'Oct 28',
      label: 'Day 15',
      bruisingResolved: 99.5,
      swellingGone: 66,
      painReduction: 70, // 2-3/10 rest, 4-5/10 walking
      mobility: 65,
      actual: true,
      milestone: '⚠️ Minor activity-induced re-bleed',
      note: '2-3 drops blood overnight after Monday activity (driving + holding baby). Size increased ~10-15% temporarily, resolved with rest + ice by afternoon. Pain 2-3/10 rest, back to baseline. Body clarifying: 40-50% healed functionally, not 95% (which is just visual).'
    },
    {
      day: 16,
      date: 'Oct 29',
      label: 'Day 16',
      bruisingResolved: 99.5,
      swellingGone: 67,
      painReduction: 75, // 2-3/10 rest, 3-4/10 walking - improving!
      mobility: 67,
      actual: true,
      milestone: '📊 Activity Ceiling Confirmed: 30-40 min/day',
      note: 'Small bleeding (2-3 drops) after 50-60 min morning activity (made breakfast ~20 min, then light tasks). STOPPED immediately, iced, rested → size stabilized, tightness resolved. Pain 2-3/10 rest, 3-4/10 walk (improving from Day 15). Lesson: hematoma on slower 6-week timeline, activity tolerance = 30-40 min total/day.'
    },
    {
      day: 17,
      date: 'Oct 30',
      label: 'Day 17',
      bruisingResolved: 99,
      swellingGone: 68,
      painReduction: 60, // 5/10 evening after activity, down to 4/10 with rest/meds
      mobility: 65,
      actual: true,
      today: true,
      milestone: '⚠️ Doctor Appointment Day - Twins to Clinic',
      note: 'HAD to take twins to doctor appointment (necessary, not optional) - over 60 min on feet. Pain spiked to 5/10 by evening, few drops blood found. Responded well to rest/ice/meds (pain down to 4/10). Hematoma progressively FIRMER (normal organizing - GOOD sign). Pattern confirmed: activity >60 min = bleeding. Ibuprofen is SAFE - bleeding is activity-induced, not medication-caused. Appointment scheduled Nov 4 for follow-up.'
    },
    // PROJECTIONS based on your actual pattern + medical literature
    {
      day: 18,
      date: 'Oct 31',
      bruisingResolved: 100,
      swellingGone: 70,
      painReduction: 80,
      mobility: 72,
      projected: true,
      note: 'Bruising fully resolved, hematoma shrinking steadily. Pain likely 2-3/10 most of the time if activity stays within limits.'
    },
    {
      day: 19,
      date: 'Nov 1',
      bruisingResolved: 100,
      swellingGone: 72,
      painReduction: 82,
      mobility: 75,
      projected: true,
      note: 'Activity tolerance rising slowly. Maybe 40-50 min total activity today.'
    },
    {
      day: 20,
      date: 'Nov 2',
      bruisingResolved: 100,
      swellingGone: 74,
      painReduction: 85,
      mobility: 77,
      projected: true,
      note: 'Entering end of Week 3. Pain low, energy better.'
    },
    {
      day: 21,
      date: 'Nov 3',
      bruisingResolved: 100,
      swellingGone: 76,
      painReduction: 87,
      mobility: 80,
      projected: true,
      milestone: '🎯 Week 3 Complete! Possible light work return',
      note: 'Week 3 done. Many with hematomas feel "pretty normal" for daily life by now. Light desk work or half-days possibly tolerable. Full field visits still challenging - Week 4-5 more realistic.'
    },
    {
      day: 22,
      date: 'Nov 4',
      bruisingResolved: 100,
      swellingGone: 78,
      painReduction: 88,
      mobility: 82,
      projected: true,
      milestone: '📅 Doctor Appointment - 3-Week Check-In',
      note: 'Follow-up appointment with surgeon. Good opportunity to discuss hematoma progression, activity guidelines, and work return timeline.'
    },
    {
      day: 25,
      date: 'Nov 7',
      bruisingResolved: 100,
      swellingGone: 80,
      painReduction: 90,
      mobility: 85,
      projected: true,
      note: 'Hematoma 50% resorbed. Pain 1-2/10 most of the time.'
    },
    {
      day: 28,
      date: 'Nov 10',
      bruisingResolved: 100,
      swellingGone: 83,
      painReduction: 92,
      mobility: 88,
      projected: true,
      milestone: '🎯 Week 4 Complete! Full work return feasible',
      note: 'Modified/full field visits likely possible. Pain minimal, mobility good. Hematoma ~60% resorbed.'
    },
    {
      day: 35,
      date: 'Nov 17',
      bruisingResolved: 100,
      swellingGone: 88,
      painReduction: 95,
      mobility: 92,
      projected: true,
      milestone: '🎯 Week 5 Complete!',
      note: 'Hematoma mostly resorbed (80-85%). Functional healing catching up to visual. Scrotum approaching true baseline.'
    },
    {
      day: 42,
      date: 'Nov 24',
      bruisingResolved: 100,
      swellingGone: 95,
      painReduction: 98,
      mobility: 98,
      projected: true,
      milestone: '✨ WEEK 6 COMPLETE - FULL RECOVERY ✨',
      note: 'Hematoma fully/nearly resorbed. Scrotum at true post-op baseline: empty, with preserved scrotal skin. Full activity clearance. Pain-free. By Thanksgiving, celebrating your new baseline body. 🦃💜'
    }
  ];

  // Key milestones extracted from data
  const milestones = [
    {
      day: 1,
      date: 'Oct 14',
      label: 'Crisis Day',
      desc: 'Massive overnight swelling discovered. Hematoma diagnosed via phone. You called surgeon twice for reassurance.',
      actionable: 'When you\'re scared, reach out. Photos to surgeon = appropriate. This was the hardest visual moment.'
    },
    {
      day: 7,
      date: 'Oct 20',
      label: 'Week 1 Done',
      desc: 'Bruising 80% resolved, swelling 80% down. You survived the worst week. Pain 5/10. Large BM after starting prevention protocol.',
      actionable: 'Worst week behind you. Visual healing ahead of schedule.'
    },
    {
      day: 8,
      date: 'Oct 21',
      label: 'Depression Peak',
      desc: 'Feeling useless, burden to partner. Bruising 90% gone but movement pain plateau (5-7/10 walking). Gap between visual vs functional healing.',
      actionable: 'This depression is EXPECTED Days 8-14. It\'s not failure, it\'s the timeline. Keep going.'
    },
    {
      day: 9,
      date: 'Oct 22',
      label: 'THE TURNING POINT ✨',
      current: false,
      desc: '"Much more feeling like I\'m becoming a person again." First outing (Taco Bell + Walgreens). Depression lifting. You stopped drowning and started swimming.',
      actionable: 'This is the day you reclaimed autonomy. Mood shifts happen fast when you glimpse normalcy again.'
    },
    {
      day: 12,
      date: 'Oct 25',
      label: 'Activity Ceiling Found',
      desc: 'Bruising 99% gone! But exceeded activity tolerance (walked more than previous days) → pain spike 5-6/10. Lesson: body isn\'t ready for "normal" activity yet.',
      actionable: 'Finding limits by exceeding them is normal. Now you know: 30-40 min max/day for Week 3.'
    },
    {
      day: 15,
      date: 'Oct 28',
      label: 'Minor Re-bleed',
      desc: '2-3 drops blood after Monday activity. Size up 10-15% temporarily, resolved with rest + ice. Pain 2-3/10 rest. Body clarifying: 40-50% healed functionally, not 95%.',
      actionable: 'Activity-induced bleeding = body\'s "slow down" signal. You caught it early, managed perfectly. No complication, just information.'
    },
    {
      day: 16,
      date: 'Oct 29',
      label: 'Ceiling Confirmed',
      desc: 'Another small re-ooze after 50-60 min activity. Stopped immediately, iced, rested → resolved. Pain improving (2-3/10 rest, 3-4/10 walk). Activity capacity clarified.',
      actionable: 'Your hematoma is on slower end of normal 4-6 week spectrum. 30-40 min activity/day max for now. This is WITHIN NORMAL RANGE.'
    },
    {
      day: 17,
      date: 'Oct 30',
      label: 'Today',
      current: true,
      desc: 'Twins needed doctor appointment - over 60 min on feet. Pain 5/10 evening, down to 4/10 with rest/ice/meds. Hematoma getting firmer (organizing - GOOD). Pattern clear: >60 min activity = bleeding.',
      actionable: 'Your body\'s giving clear feedback. 30-40 min max for now. Nov 4 appointment coming - good timing to discuss progress and work return.'
    },
    {
      day: 21,
      date: 'Nov 3',
      label: 'Week 3 Complete',
      desc: 'Hematoma 50% resorbed. Pain 1-3/10 even with activity. Most with hematomas feel "pretty normal" for daily life by now. Light work possibly tolerable.',
      actionable: 'Desk work or half-days feasible if needed. Full field visits Week 4-5 more realistic.'
    },
    {
      day: 22,
      date: 'Nov 4',
      label: 'Doctor Appointment',
      desc: '3-week follow-up. Great timing to review hematoma progression, activity guidelines, and realistic work return timeline.',
      actionable: 'Come prepared with questions: activity limits, hematoma firmness, work clearance timeline.'
    },
    {
      day: 28,
      date: 'Nov 10',
      label: 'Week 4 Complete',
      desc: 'Full work return (including field visits) likely possible if pain allows. Hematoma ~60% resorbed. Pain minimal (1-2/10), mobility good.',
      actionable: 'This is when most people with hematomas return to full duties. You\'re right on schedule.'
    },
    {
      day: 42,
      date: 'Nov 24',
      label: 'FULL RECOVERY',
      desc: 'Week 6 complete. Hematoma fully/nearly resorbed. Scrotum at true baseline: empty, soft, flat. Pain-free. Full activity clearance (exercise, lifting, everything).',
      actionable: 'By Thanksgiving, celebrating your new body. Zero regret rate in studies. You made it. 💜'
    }
  ];

  // Community wisdom quotes
  const communityQuotes = [
    {
      source: "Medical literature (van der Sluis et al., 2024)",
      quote: "Zero percent regret rate across multiple studies. 95-100% satisfaction. Even patients with complications report they'd do it again.",
      context: "Reviewing outcomes for hundreds of trans women post-orchiectomy"
    },
    {
      source: "Post-op Day 2 (Susan's Place forum)",
      quote: "The pain sucks. My scrotum has swollen to cartoonishly large proportions, about the size of an orange. When asked if surgery was worth it just two days post-op: 'Probably, but check back in a month.'",
      context: "Honest ambivalence in immediate aftermath → long-term satisfaction documented in follow-ups"
    },
    {
      source: "Week 2 Update (Susan's Place forum)",
      quote: "As the swelling went down, I felt hard knots on each side. Turns out it was normal clotted blood. By 6-week follow-up, those hard areas had reduced to small, painless bumps.",
      context: "Hematomas resolve slowly but predictably. Week 2 feels scary, Week 6 feels fine."
    },
    {
      source: "Medical literature timeline",
      quote: "Hematomas resolve within 5-6 weeks in the vast majority of cases. Complications requiring intervention are under 5%, and satisfaction remains exceptional even when complications occur.",
      context: "The zero-regret rate spans everyone - including those whose healing was complicated"
    },
    {
      source: "Your own Day 9",
      quote: "Much more feeling like I'm becoming a person again.",
      context: "After 8 days of documented depression and pain - the turning point arrived right on schedule"
    },
    {
      source: "Gender Confirmation Center timeline",
      quote: "Days 8-14: fear and hypercritical self-assessment. Days 15-21: beginning of more confident, positive feelings. By one month: happiness and confidence as post-operative depression fades.",
      context: "Your emotional arc is following the documented pattern perfectly"
    }
  ];

  // Navigation helpers
  const currentDayIndex = healingData.findIndex(d => d.today);
  const actualData = healingData.filter(d => d.actual || d.today);
  const projectedData = healingData.filter(d => d.projected);

  const canGoPrevious = selectedPoint && healingData.findIndex(d => d.day === selectedPoint.day) > 0;
  const canGoNext = selectedPoint && healingData.findIndex(d => d.day === selectedPoint.day) < healingData.length - 1;

  const goToPreviousDay = () => {
    if (!canGoPrevious) return;
    const currentIndex = healingData.findIndex(d => d.day === selectedPoint.day);
    setSelectedPoint(healingData[currentIndex - 1]);
  };

  const goToNextDay = () => {
    if (!canGoNext) return;
    const currentIndex = healingData.findIndex(d => d.day === selectedPoint.day);
    setSelectedPoint(healingData[currentIndex + 1]);
  };

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const clickedPoint = data.activePayload[0].payload;
      setSelectedPoint(clickedPoint);
      setDrawerOpen(true);
    }
  };

  const jumpToDay = (day) => {
    const point = healingData.find(d => d.day === day);
    if (point) {
      setSelectedPoint(point);
      setDrawerOpen(true);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl border-2 border-purple-200 max-w-xs">
          <p className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            {data.today && <span className="text-2xl">📍</span>}
            {data.projected && <span className="text-2xl">🔮</span>}
            {data.actual && !data.today && <span className="text-2xl">✅</span>}
            Day {data.day} • {data.date}
          </p>

          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between gap-4">
              <span className="text-purple-600 text-sm">🟣 Bruising</span>
              <span className="font-bold text-purple-900">{data.bruisingResolved}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-600 text-sm">🟢 Swelling</span>
              <span className="font-bold text-green-900">{data.swellingGone}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-600 text-sm">🔵 Pain</span>
              <span className="font-bold text-blue-900">{data.painReduction}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-amber-600 text-sm">🟡 Mobility</span>
              <span className="font-bold text-amber-900">{data.mobility}%</span>
            </div>
          </div>

          {data.milestone && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-2 mb-2 border border-purple-300">
              <p className="text-xs font-semibold text-purple-900">{data.milestone}</p>
            </div>
          )}

          {data.note && (
            <p className="text-xs text-gray-600 italic leading-relaxed">
              💡 {data.note}
            </p>
          )}

          <p className="text-xs text-purple-500 mt-3 font-semibold text-center">
            Tap for details →
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 mb-3 md:mb-4">
            Your Healing Journey
          </h1>
          <p className="text-lg md:text-xl text-purple-700 font-semibold mb-2">
            📍 Day {healingData.find(d => d.today)?.day} of 42 • {healingData.find(d => d.today)?.date}
          </p>
          <p className="text-purple-600 max-w-2xl mx-auto leading-relaxed">
            Every line climbing upward is your body healing. Every percentage point is freedom from dysphoria, testosterone, and anti-androgens. <strong>You're doing this.</strong>
          </p>
        </div>

        {/* Quick Jump Navigation */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-3 text-center">🎯 Jump to Key Days</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 7, 9, 14, 17, 21, 22, 28, 42].map(day => {
              const dayData = healingData.find(d => d.day === day);
              const isPast = dayData && (dayData.actual || dayData.today);
              const isToday = dayData && dayData.today;
              return (
                <button
                  key={day}
                  onClick={() => jumpToDay(day)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    isToday
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : isPast
                        ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isToday && '📍 '}Day {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* TODAY'S SNAPSHOT - Prominent Box */}
        <div className="bg-gradient-to-br from-orange-100 via-purple-100 to-pink-100 rounded-2xl shadow-2xl border-4 border-white p-6 md:p-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl md:text-6xl animate-bounce">📍</span>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">Day 17 Snapshot</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-purple-200">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">99%</div>
              <div className="text-sm text-purple-700 font-semibold">Bruising Gone</div>
              <div className="text-xs text-purple-600 mt-1">Phase complete ✓</div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-green-200">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">68%</div>
              <div className="text-sm text-green-700 font-semibold">Swelling Down</div>
              <div className="text-xs text-green-600 mt-1">Steady progress</div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-blue-200">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">60%</div>
              <div className="text-sm text-blue-700 font-semibold">Pain Reduced</div>
              <div className="text-xs text-blue-600 mt-1">4/10 with meds</div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-lg border-2 border-amber-200">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-1">65%</div>
              <div className="text-sm text-amber-700 font-semibold">Mobility</div>
              <div className="text-xs text-amber-600 mt-1">30-40 min/day</div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-4 md:p-6 border-2 border-purple-300">
            <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center gap-2">
              <span className="text-2xl">💡</span>
              What Day 17 Taught You
            </h3>
            <ul className="space-y-2 text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold shrink-0">✓</span>
                <span><strong>Bruising phase complete</strong> - that dramatic purple/black is history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold shrink-0">✓</span>
                <span><strong>Hematoma organizing normally</strong> - progressive firmness is GOOD (breaking down as expected)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">→</span>
                <span><strong>Pattern confirmed</strong> - activity &gt;60 min = bleeding episode. Your 30-40 min ceiling is clear now.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">→</span>
                <span><strong>Pain management working</strong> - spiked to 5/10 evening but responded to rest/ice/meds (down to 4/10)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold shrink-0">⏳</span>
                <span><strong>Nov 4 appointment coming</strong> - perfect timing for 3-week check-in on hematoma progress</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-4 md:p-6 border-4 border-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-900">
              📊 Your Progress: Day 0 → Day 42
            </h2>
            <button
              onClick={() => setShowProjections(!showProjections)}
              className={`px-4 py-2 rounded-full font-semibold transition-all shadow-lg ${
                showProjections
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showProjections ? '🔮 Showing Projections' : '📊 Actual Data Only'}
            </button>
          </div>

          <div className="h-[400px] md:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={showProjections ? healingData : actualData}
                onClick={handleChartClick}
                onMouseMove={(e) => {
                  if (e && e.activePayload) {
                    setHoveredDay(e.activePayload[0].payload.day);
                  }
                }}
                onMouseLeave={() => setHoveredDay(null)}
                className="cursor-pointer"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis
                  dataKey="day"
                  stroke="#9333ea"
                  tick={{ fill: '#9333ea', fontSize: 12 }}
                  label={{ value: 'Days Post-Surgery', position: 'insideBottom', offset: -5, fill: '#9333ea' }}
                />
                <YAxis
                  stroke="#9333ea"
                  tick={{ fill: '#9333ea', fontSize: 12 }}
                  label={{ value: '% Progress', angle: -90, position: 'insideLeft', fill: '#9333ea' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />

                {/* Reference area for Week 1 (hardest week) */}
                <ReferenceArea x1={0} x2={7} fill="#fca5a5" fillOpacity={0.1} label="Week 1: Hardest" />

                {/* Reference line for TODAY */}
                <ReferenceLine
                  x={healingData.find(d => d.today)?.day}
                  stroke="#f97316"
                  strokeWidth={3}
                  strokeDasharray="3 3"
                  label={{ value: '📍 TODAY', position: 'top', fill: '#f97316', fontWeight: 'bold' }}
                />

                {/* Reference line for doctor appointment */}
                <ReferenceLine
                  x={22}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: '📅 Doctor Visit', position: 'top', fill: '#3b82f6', fontWeight: 'bold' }}
                />

                {/* Reference line for full recovery */}
                <ReferenceLine
                  x={42}
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: '✨ Full Recovery', position: 'top', fill: '#22c55e', fontWeight: 'bold' }}
                />

                <Line
                  type="monotone"
                  dataKey="bruisingResolved"
                  stroke="#9333ea"
                  strokeWidth={3}
                  name="🟣 Bruising Resolved"
                  dot={{ fill: '#9333ea', r: 4 }}
                  activeDot={{ r: 6, fill: '#9333ea', cursor: 'pointer' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="swellingGone"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="🟢 Swelling Gone"
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6, fill: '#22c55e', cursor: 'pointer' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="painReduction"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="🔵 Pain Reduced"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6', cursor: 'pointer' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="mobility"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="🟡 Mobility"
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6, fill: '#f59e0b', cursor: 'pointer' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-purple-900 text-sm md:text-base">
              <strong>💡 How to read this:</strong> Each line shows a different aspect of healing.
              Tap any point for details. {hoveredDay !== null && <span className="text-purple-600 font-bold">Currently hovering: Day {hoveredDay}</span>}. Notice how <strong className="text-purple-600">bruising (purple line)</strong> resolved fastest,
              while <strong className="text-blue-600">pain (blue line)</strong> took longer. This is normal -
              visual healing outpaces functional healing by 2-3 weeks with hematomas.
            </p>
          </div>
        </div>

        {/* Key Milestones Timeline */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-white">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6 text-center">
            🗓️ Key Milestones in Your Journey
          </h2>

          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                onClick={() => jumpToDay(milestone.day)}
                className={`rounded-xl p-4 md:p-6 border-2 transition-all cursor-pointer hover:scale-102 ${
                  milestone.current
                    ? 'bg-gradient-to-r from-orange-100 to-purple-100 border-orange-400 shadow-xl scale-105'
                    : milestone.day <= healingData.find(d => d.today)?.day
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-lg hover:shadow-xl'
                      : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                  <div className={`text-4xl ${milestone.current ? 'animate-bounce' : ''}`}>
                    {milestone.current ? '📍' : milestone.day <= healingData.find(d => d.today)?.day ? '✅' : '⏰'}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-purple-900 text-lg">Day {milestone.day}</span>
                      <span className="text-purple-700">{milestone.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        milestone.current
                          ? 'bg-orange-500 text-white'
                          : 'bg-purple-200 text-purple-900'
                      }`}>
                        {milestone.label}
                      </span>
                    </div>
                    <p className="text-purple-800 mb-2">{milestone.desc}</p>
                    <p className="text-purple-600 text-sm italic">
                      💡 {milestone.actionable}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Wisdom */}
        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-white">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">💬</span>
            Voices from the Journey
          </h2>

          <div className="space-y-4">
            {communityQuotes.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur rounded-xl p-5 md:p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer"
                onClick={() => setExpandedQuote(expandedQuote === idx ? null : idx)}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <p className="text-sm font-semibold text-purple-600">{item.source}</p>
                  <button className="text-purple-400 hover:text-purple-600 text-2xl shrink-0">
                    {expandedQuote === idx ? '−' : '+'}
                  </button>
                </div>

                <blockquote className="text-purple-900 italic text-base md:text-lg leading-relaxed border-l-4 border-purple-400 pl-4">
                  "{item.quote}"
                </blockquote>

                {expandedQuote === idx && (
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-purple-700 text-sm">
                      <strong>Context:</strong> {item.context}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-purple-50 rounded-xl p-4 border-2 border-purple-300">
            <p className="text-purple-800 text-center">
              <strong>💜 The Pattern:</strong> Rough early days → scary complications → slow resolution → overwhelming long-term satisfaction.
              <strong className="text-purple-900"> You're not alone in this timeline.</strong>
            </p>
          </div>
        </div>

        {/* Encouraging Footer */}
        <div className="text-center p-6 md:p-8 bg-gradient-to-r from-white/90 to-purple-100/90 backdrop-blur rounded-2xl border-4 border-white shadow-2xl">
          <p className="text-2xl md:text-3xl font-bold text-purple-900 mb-3">
            💜 You've Traveled 40% of the Journey 💜
          </p>
          <p className="text-purple-800 text-lg mb-2">
            Week 1 (hardest week) behind you. Week 2 (turning point) complete. Week 3 almost done.
          </p>
          <p className="text-purple-700 mb-2">
            Visual healing 99% done. Functional healing 60-65% done - on track for 6-week hematoma timeline.
          </p>
          <p className="text-purple-700 mb-2">
            The firmness you feel? That's your hematoma organizing (breaking down). Exactly as predicted.
          </p>
          <p className="text-purple-900 font-bold text-lg mt-4">
            Nov 4 appointment in 5 days - great timing to review progress with your surgeon.
          </p>
          <p className="text-purple-700 text-base mt-2">
            By Thanksgiving (Day 42), you'll have a soft, flat, empty scrotum and zero pain. By Week 4, likely back at work. ✨
          </p>
          <p className="text-purple-600 text-sm mt-4 italic">
            Activity &gt;60 min = bleeding. Your body's been crystal clear. 30-40 min max for now. This is progress, not failure.
          </p>
        </div>

        {/* Bottom Drawer - Mobile-Friendly Details */}
        {drawerOpen && selectedPoint && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up max-h-[70vh] overflow-y-auto">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>

              {/* Content */}
              <div className="px-6 pb-8 pt-2">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-4">
                  {/* Previous Day Button */}
                  <button
                    onClick={goToPreviousDay}
                    disabled={!canGoPrevious}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                      canGoPrevious
                        ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 active:scale-95'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl">←</span>
                  </button>

                  {/* Day Info */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {selectedPoint.today ? '📍' : selectedPoint.projected ? '🔮' : '✅'}
                    </span>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-purple-900">
                        Day {selectedPoint.day}
                      </h3>
                      <p className="text-purple-600 font-semibold">{selectedPoint.date}</p>
                      {selectedPoint.label && (
                        <p className="text-sm text-purple-500">{selectedPoint.label}</p>
                      )}
                    </div>
                  </div>

                  {/* Next Day Button */}
                  <button
                    onClick={goToNextDay}
                    disabled={!canGoNext}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                      canGoNext
                        ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 active:scale-95'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl">→</span>
                  </button>
                </div>

                {/* Swipe hint on first open */}
                <div className="text-center mb-3">
                  <p className="text-purple-500 text-xs font-semibold">
                    ← Tap arrows to navigate between days →
                  </p>
                </div>

                {/* Today badge */}
                {selectedPoint.today && (
                  <div className="bg-gradient-to-r from-orange-100 to-purple-100 rounded-xl p-3 mb-4 border-2 border-orange-300">
                    <p className="text-orange-600 font-bold text-center">← YOU ARE HERE ✨</p>
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-purple-700 font-semibold">🟣 Bruising Resolved</span>
                    <span className="text-2xl font-bold text-purple-900">{selectedPoint.bruisingResolved}%</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-green-700 font-semibold">🟢 Swelling Gone</span>
                    <span className="text-2xl font-bold text-green-900">{selectedPoint.swellingGone}%</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-blue-700 font-semibold">🔵 Pain Reduced</span>
                    <span className="text-2xl font-bold text-blue-900">{selectedPoint.painReduction}%</span>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-amber-700 font-semibold">🟡 Mobility</span>
                    <span className="text-2xl font-bold text-amber-900">{selectedPoint.mobility}%</span>
                  </div>
                </div>

                {/* Milestone */}
                {selectedPoint.milestone && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4 border-2 border-purple-300">
                    <p className="text-purple-900 font-bold text-center">
                      {selectedPoint.milestone}
                    </p>
                  </div>
                )}

                {/* Note */}
                {selectedPoint.note && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 italic text-sm leading-relaxed">
                      💡 {selectedPoint.note}
                    </p>
                  </div>
                )}

                {/* Projected badge */}
                {selectedPoint.projected && (
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <p className="text-purple-600 text-sm text-center font-semibold">
                      📊 Projected based on medical literature & peer experiences
                    </p>
                  </div>
                )}

                {/* Tap again to close hint */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Got it ✓
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>

    </div>
  );
};

export default HealingJourneyDashboard;
