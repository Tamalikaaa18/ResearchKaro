import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, Users, ChevronRight, Star, ChevronDown, CalendarPlus, ExternalLink, Filter } from 'lucide-react';
import Papa from 'papaparse';

interface Opportunity {
  id: string;
  title: string;
  institution: string;
  department: string;
  deadline: string;
  link: string;
}

// Helper function to safely parse Indian date format (DD.MM.YY or DD.MM.YYYY)
const parseIndianDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();

  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(Number(fullYear), Number(month) - 1, Number(day));
  }

  return new Date(dateStr);
};

export default function LandingPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const [filterInst, setFilterInst] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [sortDeadline, setSortDeadline] = useState('asc');

  useEffect(() => {
    fetch('opportunities.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as Opportunity[];
            setOpportunities(data);

            const insts = Array.from(new Set(data.map(d => d.institution))).filter(Boolean).sort();
            const depts = Array.from(new Set(data.map(d => d.department))).filter(Boolean).sort();
            setInstitutions(insts);
            setDepartments(depts);
          }
        });
      });
  }, []);

  const filteredOpps = opportunities
    .filter(opp => (filterInst ? opp.institution === filterInst : true))
    .filter(opp => (filterDept ? opp.department === filterDept : true))
    .sort((a, b) => {
      const dateA = parseIndianDate(a.deadline).getTime();
      const dateB = parseIndianDate(b.deadline).getTime();
      return sortDeadline === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Research<span className="text-blue-600">Karo</span></span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">How it works</a>
              <a href="#opportunities" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Open Opportunities</a>
              <a href="#vision" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">The Vision</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="mailto:tamalikadas1810@gmail.com" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
          >
            Find your next research project. <span className="text-blue-600">Together.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
          >
            The student-led community for discovering research opportunities in India. Built by students, for students, to demystify academia and make research accessible to everyone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#opportunities" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              View Openings <ChevronRight className="w-5 h-5" />
            </a>
            <a href="mailto:tamalikadas1810@gmail.com" className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2">
              Get in Touch
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-slate-500 font-medium"
          >
            Reach out directly via email to collaborate or share opportunities.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200"
            alt="Students working in a lab"
            className="rounded-3xl shadow-2xl object-cover h-[400px] md:h-[500px] w-full border-4 border-white"
          />
        </motion.div>
      </section>

      {/* Opportunities Section (Real Data from CSV) */}
      <section id="opportunities" className="py-20 md:py-32 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Live Opportunities</h2>
              <p className="text-lg text-slate-600">Updated from our student-sourced spreadsheet.</p>
            </div>
            <a href="mailto:tamalikadas1810@gmail.com" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm self-start md:self-auto inline-block">
              Submit an Opening
            </a>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-slate-500 w-full md:w-auto md:pr-4 md:border-r border-slate-100">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter By:</span>
            </div>

            <select
              value={filterInst}
              onChange={e => setFilterInst(e.target.value)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            >
              <option value="">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>

            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            >
              <option value="">All Subjects</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <div className="w-full md:w-auto md:ml-auto">
              <select
                value={sortDeadline}
                onChange={e => setSortDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              >
                <option value="asc">Deadline: Soonest</option>
                <option value="desc">Deadline: Farthest</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOpps.length > 0 ? filteredOpps.map((opp) => {
              const parsedDate = parseIndianDate(opp.deadline);

              // Correctly format the date string to YYYYMMDD for Google Calendar
              const yyyy = parsedDate.getFullYear();
              const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
              const dd = String(parsedDate.getDate()).padStart(2, '0');
              const start = `${yyyy}${mm}${dd}`;

              const calUrl = new URL('https://calendar.google.com/calendar/render');
              calUrl.searchParams.append('action', 'TEMPLATE');
              calUrl.searchParams.append('text', `Deadline: ${opp.title} at ${opp.institution}`);
              calUrl.searchParams.append('details', `Remember to apply for the ${opp.title} position at ${opp.institution}.\n\nApply link: ${opp.link}`);
              calUrl.searchParams.append('dates', `${start}T000000Z/${start}T235959Z`);

              return (
                <div key={opp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{opp.title}</h3>
                    <p className="text-slate-600 font-medium">{opp.institution} &bull; <span className="text-slate-500 font-normal">{opp.department}</span></p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto text-center whitespace-nowrap">
                      Deadline: {parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex w-full sm:w-auto gap-2">
                      <a
                        href={calUrl.toString()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        <CalendarPlus className="w-4 h-4" /> Add to Cal
                      </a>
                      <a
                        href={opp.link}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Apply <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-lg">No opportunities match your selected filters.</p>
                <button onClick={() => { setFilterInst(''); setFilterDept(''); }} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-50 p-10 md:p-16 rounded-3xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Day One: The Vision</h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  Everyone I speak to in my network seems to be saying the same thing: <strong>Finding research opportunities has become incredibly difficult.</strong>
                </p>
                <p>
                  Doing research in India is challenging enough. But finding project positions, research internships, research assistantships, or even PhD opportunities? That's often the harder part. There are great platforms like FindAPhD and EURAXESS that aggregate research opportunities across Europe. Researchers know where to look, and opportunities are visible and accessible.
                </p>
                <p>
                  In India, however, the landscape feels fragmented. Yes, opportunities exist. But they're scattered across institute websites, department pages, faculty emails, LinkedIn posts, WhatsApp groups, and niche portals. Many platforms require sign-ups, some hide information behind paywalls, and others are simply difficult to discover unless you're already in the right circle.
                </p>
                <p>
                  <strong>Research should not be accessible only to those who know where to look.</strong>
                </p>
                <p>
                  What if there were a grassroots, community-driven platform that brought together research opportunities across India in one place? A platform where students, graduates, and researchers could easily discover openings without barriers, subscriptions, or endless searching.
                </p>
                <p>
                  The goal wouldn't be to replace institutions, but to make opportunities more visible and accessible for everyone.
                </p>
                <p className="font-semibold text-slate-900 text-xl mt-8">
                  Because talent is everywhere. Information isn't.
                </p>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-800">
                    <strong>I'm building this solo right now to help the community.</strong> If you'd like to collaborate, help build this out, or just submit an open opportunity, please reach out!
                  </p>
                </div>
              </div>
            </div>
            {/* Background decorative element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section id="benefits" className="bg-brand-light py-20 md:py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Join Our Community?</h2>
            <p className="text-lg text-slate-600">We're crowdsourcing the best opportunities, sharing application advice, and helping each other navigate the academic world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Search className="w-8 h-8 text-blue-600" />,
                title: "Student-Curated Projects",
                description: "Access a live database of research openings shared and vetted by fellow students. Real opportunities, no gatekeeping."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Peer Support Network",
                description: "Connect with seniors and peers who have previously worked at the labs you're applying to. Get insider advice on cold emailing and interviews."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                title: "Open Resources",
                description: "Explore our community-driven guides on writing research proposals, structuring your CV, and making the most of your internship."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to join the movement?</h2>
          <p className="text-blue-100 text-xl mb-10">We're building the most supportive academic network in India. Send me an email to get involved or list an opportunity.</p>
          <a href="mailto:tamalikadas1810@gmail.com" className="inline-block bg-white text-blue-600 hover:bg-slate-50 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Email Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white tracking-tight">Research<span className="text-blue-400">Karo</span></span>
            </div>
            <p className="max-w-xs mb-6">A grassroots initiative run by students, aiming to make research opportunities accessible and transparent for everyone.</p>
            <p className="text-sm">© {new Date().getFullYear()} ResearchIndia Community.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#opportunities" className="hover:text-white transition-colors">Opportunities Board</a></li>
              <li><a href="mailto:tamalikadas1810@gmail.com" className="hover:text-white transition-colors">Submit Opportunity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentorship</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Application Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repo (Open Source)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}