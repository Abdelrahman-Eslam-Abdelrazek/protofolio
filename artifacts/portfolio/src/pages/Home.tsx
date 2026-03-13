import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Star, Github, MapPin, Download, Mail, Phone, ExternalLink, ShieldCheck, Code, Server } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

// --- Typewriter Component ---
function Typewriter() {
  const words = ["Full-Stack Developer", "Web Security Specialist", "Building AI Security Tools"];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleTyping = () => {
      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 80);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="inline-flex items-center min-h-[30px]">
      {text}
      <span className="animate-pulse ml-1 inline-block w-2 h-5 bg-ink-muted"></span>
    </span>
  );
}

// --- 3D Project Card Component ---
interface ProjectProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveLink?: string;
  githubLink: string;
  status?: string;
}

function ProjectCard({ project, index }: { project: ProjectProps; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // max tilt 8 deg
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  };

  return (
    <div className="preserve-3d" style={{ perspective: "1000px" }}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bg-white border border-border p-8 md:p-10 transition-transform duration-300 ease-out hover:shadow-deep flex flex-col justify-between h-full group"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Radar Animation for Project 6 */}
        {project.id === "06" && (
          <div className="absolute top-8 right-8 w-16 h-16 text-ink opacity-10 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(20px)" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-slow-spin" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <path d="M50 50 L50 5" stroke="currentColor" strokeWidth="2" className="origin-center animate-radar" />
            </svg>
          </div>
        )}

        <div style={{ transform: "translateZ(30px)" }}>
          <div className="text-[80px] md:text-[100px] leading-none text-off-white font-display font-bold select-none mb-4 transition-colors group-hover:text-border">
            {project.id}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-4 relative z-10">{project.title}</h3>
          
          {project.status && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-off-white border border-border rounded-sm text-xs font-mono mb-4 text-ink-muted relative z-10">
              {project.status === "🔨 In Development" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ink"></span>
                </span>
              )}
              {project.status}
            </div>
          )}
          
          <p className="font-sans text-ink-muted leading-relaxed mb-8">
            {project.description}
          </p>
        </div>

        <div style={{ transform: "translateZ(40px)" }}>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs font-mono border border-ink text-ink bg-white">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-border">
            {project.liveLink && (
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noreferrer"
                className="group/link flex items-center gap-2 font-sans font-semibold text-sm text-ink"
              >
                View Project 
                <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
              </a>
            )}
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noreferrer"
              className="text-ink-muted hover:text-ink transition-colors"
              aria-label="GitHub Repository"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroScrollYProgress, [0, 1], [1, 0]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen, normalize between -1 and 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setHeroMousePos({ x, y });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const projects: ProjectProps[] = [
    {
      id: "01",
      title: "EgyRamadan",
      description: "Live Arabic movies & series streaming platform with a comprehensive episode database and seamless playback experience.",
      tags: ["React", "Next.js", "Tailwind CSS"],
      liveLink: "https://www.egyramadan.me/",
      githubLink: "https://github.com/Abdelrahman-Eslam-Abdelrazek/egyramadan1"
    },
    {
      id: "02",
      title: "StreamSphere",
      description: "A modern, highly-responsive movie and series streaming application featuring advanced search and categorization.",
      tags: ["React", "Next.js", "Tailwind CSS"],
      githubLink: "https://github.com/Abdelrahman-Eslam-Abdelrazek/StreamSphere"
    },
    {
      id: "03",
      title: "EgyptianTravelEase",
      description: "Tourism booking platform equipped with an admin dashboard, real-time chat, and an intelligent car suggestion engine.",
      tags: ["Next.js", "PostgreSQL", "Express"],
      githubLink: "https://github.com/Abdelrahman-Eslam-Abdelrazek/EgyptianTravelEase"
    },
    {
      id: "04",
      title: "DarkLeakArchive",
      description: "Robust cybersecurity platform hosting a leak archive, community forum, leaderboard system, and integrated chat API.",
      tags: ["Node.js", "Express", "PostgreSQL"],
      githubLink: "https://github.com/Abdelrahman-Eslam-Abdelrazek/DarkLeakArchive"
    },
    {
      id: "05",
      title: "ArabicEduPlatform",
      description: "Comprehensive online learning management system tailored for delivering high-quality Arabic educational content.",
      tags: ["React", "Next.js", "Supabase"],
      githubLink: "https://github.com/Abdelrahman-Eslam-Abdelrazek/ArabicEduPlatform"
    },
    {
      id: "06",
      title: "AI Security Analyzer",
      description: "Next-generation tool leveraging machine learning models to scan and detect real-world vulnerabilities in modern web applications.",
      tags: ["Python", "Machine Learning", "React"],
      githubLink: "#",
      status: "🔨 In Development"
    }
  ];

  const profileData = {
    name: "Abdelrahman Eslam Abdelrazek",
    role: "Full-Stack Dev + Web Security",
    location: "Cairo, Egypt 🇪🇬",
    currentFocus: "AI Security Tools + ML",
    openTo: "Freelance & Collaborations",
    funFact: "I build websites then try to break them"
  };

  return (
    <div className="bg-white min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-ink origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- HERO SECTION --- */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-white bg-dot-grid"
      >
        {/* Decorative large "01" bottom right */}
        <div className="absolute bottom-0 right-0 text-[220px] md:text-[340px] leading-none text-[#f0f0f0] font-display pointer-events-none select-none z-0">
          01
        </div>

        {/* Floating Wireframe Sphere — right side desktop */}
        <div className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[360px] h-[360px] pointer-events-none z-0 opacity-60">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="0.3" stroke="#d0d0cc" className="w-full h-full animate-slow-spin">
            <circle cx="50" cy="50" r="48" />
            <ellipse cx="50" cy="50" rx="48" ry="18" />
            <ellipse cx="50" cy="50" rx="48" ry="18" transform="rotate(60 50 50)" />
            <ellipse cx="50" cy="50" rx="48" ry="18" transform="rotate(-60 50 50)" />
            <ellipse cx="50" cy="50" rx="18" ry="48" />
            <line x1="2" y1="50" x2="98" y2="50" />
            <line x1="50" y1="2" x2="50" y2="98" />
          </svg>
        </div>

        <div className="max-w-6xl w-full mx-auto px-8 md:px-16 relative z-10">

          {/* Small label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.25em] text-ink-faint uppercase mb-8"
          >
            Portfolio — 2025
          </motion.p>

          {/* Name block */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.35, delay: 0.1 }}
              className="relative"
            >
              {/* Back shadow layer */}
              <span
                className="absolute top-0 left-0 font-display text-[clamp(52px,10vw,112px)] leading-[1] tracking-wide text-ink-faint select-none pointer-events-none"
                style={{ transform: `translate3d(${heroMousePos.x * 6}px, ${heroMousePos.y * 6 + 5}px, 0)` }}
                aria-hidden="true"
              >
                ABDELRAHMAN ESLAM
              </span>
              {/* Front layer */}
              <span
                className="relative font-display text-[clamp(52px,10vw,112px)] leading-[1] tracking-wide text-ink block"
                style={{ transform: `translate3d(${heroMousePos.x * -3}px, ${heroMousePos.y * -3}px, 0)` }}
              >
                ABDELRAHMAN ESLAM
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.35, delay: 0.18 }}
            >
              <span
                className="font-display text-[clamp(52px,10vw,112px)] leading-[1] tracking-wide text-outline block"
                style={{ transform: `translate3d(${heroMousePos.x * -2}px, ${heroMousePos.y * -2}px, 0)` }}
              >
                ABDELRAZEK
              </span>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="origin-left h-px bg-border w-full max-w-lg mb-8"
          />

          {/* Subtitle row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-12"
          >
            <div className="font-sans text-lg md:text-xl text-ink-muted leading-relaxed">
              <Typewriter />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-ink-faint border border-border px-3 py-1.5 w-fit">
              <MapPin size={12} /> Cairo, Egypt
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, type: "spring" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-ink text-white font-sans font-semibold text-sm tracking-wide border border-ink hover:bg-ink-soft hover:shadow-deep transition-all duration-300"
            >
              View My Work
            </a>
            <a
              href="https://github.com/Abdelrahman-Eslam-Abdelrazek"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-ink font-sans font-semibold text-sm tracking-wide border border-border hover:border-ink hover:bg-off-white transition-all duration-300"
            >
              <Download size={16} /> Download CV
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 md:py-32 bg-off-white relative border-t border-border overflow-hidden">
        {/* Large Decorative Quote */}
        <div className="absolute top-10 right-10 md:left-10 text-[200px] md:text-[350px] font-serif leading-none text-[#f0f0f0] pointer-events-none select-none z-0 rotate-12">
          "
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <ScrollReveal>
              <p className="font-mono text-sm tracking-widest text-ink-muted uppercase mb-6 flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0L10 5L5 10L0 5L5 0Z"/></svg>
                About
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                I build. I secure. <br className="hidden md:block"/> I evolve.
              </h2>
              <div className="font-sans text-lg text-ink-muted leading-relaxed space-y-6">
                <p>
                  I'm Abdelrahman, a Full-Stack Developer and Web Security Specialist based in Cairo. I don't just build web applications — I harden them. 
                </p>
                <p>
                  Currently studying Computer Science at Modern Academy Cairo, I'm combining my development skills with cybersecurity expertise and machine learning to build tools that protect the web. 
                </p>
                <p>
                  My next project: an AI-powered security analyzer that detects real vulnerabilities in web applications before they can be exploited.
                </p>
              </div>

              <div className="mt-10 glass-card p-6 border-l-4 border-l-ink">
                <h4 className="font-serif font-bold text-lg mb-1">Modern Academy Cairo</h4>
                <p className="font-sans text-sm text-ink-muted">BSc Computer Science • 2023–2027</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="relative">
              {/* Terminal Box */}
              <div className="bg-white border border-ink rounded-sm shadow-deep overflow-hidden">
                <div className="bg-paper border-b border-border px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-ink/20 bg-ink/10" />
                  <div className="w-3 h-3 rounded-full border border-ink/20 bg-ink/10" />
                  <div className="w-3 h-3 rounded-full border border-ink/20 bg-ink/10" />
                  <span className="ml-4 font-mono text-xs text-ink-muted">profile.json</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="font-mono text-sm md:text-base text-ink leading-loose">
                    <span className="text-ink-muted">{"{"}</span>
                    <br/>
                    {Object.entries(profileData).map(([key, value], i, arr) => (
                      <div key={key} className="pl-4">
                        <span className="font-bold">"{key}"</span>: "{value}"{i < arr.length - 1 ? ',' : ''}
                      </div>
                    ))}
                    <span className="text-ink-muted">{"}"}</span>
                    <span className="animate-pulse inline-block w-2 h-4 bg-ink ml-1 align-middle" />
                  </pre>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border border-border bg-dot-grid" />
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Animated Dots Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          <div className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-border animate-pulse-slow"></div>
          <div className="absolute bottom-40 right-[15%] w-3 h-3 rounded-full bg-border animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-[5%] w-6 h-6 rounded-full border border-border animate-float"></div>
          <div className="absolute bottom-20 left-[20%] w-2 h-2 rounded-full bg-ink-faint animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-20">Technical Arsenal</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-border perspective-1000" style={{ perspective: "1000px" }}>
            {/* Column 1 */}
            <ScrollReveal delay={0.1} className="md:pr-8">
              <div className="flex items-center gap-3 mb-8 border-b border-ink pb-4">
                <Code size={24} className="text-ink" />
                <h3 className="font-sans text-xl font-bold">Frontend</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Tailwind CSS"].map(skill => (
                  <div key={skill} className="px-4 py-2 font-mono text-sm bg-white border border-ink text-ink transition-all duration-300 hover:bg-ink hover:text-white transform hover:-translate-y-1 hover:translate-z-8 hover:scale-105 hover:shadow-soft cursor-default">
                    {skill}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Column 2 */}
            <ScrollReveal delay={0.2} className="md:px-8">
              <div className="flex items-center gap-3 mb-8 border-b border-ink pb-4">
                <Server size={24} className="text-ink" />
                <h3 className="font-sans text-xl font-bold">Backend</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Node.js", "Express", "PostgreSQL", "Supabase", "PHP", "Python", "C++"].map(skill => (
                  <div key={skill} className="px-4 py-2 font-mono text-sm bg-white border border-ink text-ink transition-all duration-300 hover:bg-ink hover:text-white transform hover:-translate-y-1 hover:translate-z-8 hover:scale-105 hover:shadow-soft cursor-default">
                    {skill}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Column 3 */}
            <ScrollReveal delay={0.3} className="md:pl-8">
              <div className="flex items-center gap-3 mb-8 border-b border-ink pb-4">
                <ShieldCheck size={24} className="text-ink" />
                <h3 className="font-sans text-xl font-bold">Security & AI</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Ethical Hacking", "Penetration Testing", "Vulnerability Assessment", "Network Security", "Cyber Threat Intelligence", "Machine Learning (Learning)"].map(skill => (
                  <div key={skill} className="px-4 py-2 font-mono text-sm bg-white border border-ink text-ink transition-all duration-300 hover:bg-ink hover:text-white transform hover:-translate-y-1 hover:translate-z-8 hover:scale-105 hover:shadow-soft cursor-default">
                    {skill}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-24 md:py-32 bg-off-white border-t border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <p className="font-mono text-sm tracking-widest text-ink-muted uppercase mb-4 text-center md:text-left">Selected Work</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center md:text-left">Featured Projects</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx % 2 === 0 ? 0.1 : 0.2}>
                <ProjectCard project={project} index={idx} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CERTIFICATIONS SECTION --- */}
      <section id="certifications" className="py-24 md:py-32 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <p className="font-mono text-sm tracking-widest text-ink-muted uppercase mb-4 text-center">Credentials</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16 text-center">Certifications</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Cert spans 2 cols on tablet+ */}
            <ScrollReveal className="md:col-span-2 lg:col-span-2">
              <div className="bg-paper border border-border p-8 h-full flex flex-col justify-center relative overflow-hidden group hover:border-ink transition-colors duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-2 text-ink mb-4">
                  <Star fill="currentColor" size={20} />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">Featured Credential</span>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">IBM Cybersecurity Analyst Professional Certificate</h3>
                <p className="font-sans text-ink-muted mb-6">Coursera • Sep 2023</p>
                <a 
                  href="https://www.credly.com/badges/50f3fb2f-b2de-4d89-9494-195c5ffca673/public_url" 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold font-sans hover:gap-3 transition-all w-fit"
                >
                  View Badge <ExternalLink size={16} />
                </a>
              </div>
            </ScrollReveal>

            {/* Other Certs */}
            {[
              { title: "Penetration Testing, Incident Response & Forensics", issuer: "Coursera", date: "Sep 2023" },
              { title: "Cyber Threat Intelligence", issuer: "Coursera", date: "Sep 2023" },
              { title: "Network Security & Database Vulnerabilities", issuer: "Coursera", date: "Sep 2023" },
              { title: "Introduction to Cybersecurity", issuer: "Cisco", date: "Sep 2023" },
              { title: "Cybersecurity Fundamentals", issuer: "IBM SkillsBuild", date: "Sep 2023" }
            ].map((cert, idx) => (
              <ScrollReveal key={idx} delay={0.1 * (idx % 3)}>
                <div className="bg-white border border-border p-6 h-full flex flex-col justify-between hover:shadow-soft transition-shadow duration-300">
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-2 leading-snug">{cert.title}</h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="font-sans text-sm text-ink-muted">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-32 bg-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-dot-grid" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)" }} />
        
        {/* Large Decorative @ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] md:text-[800px] font-sans font-bold leading-none text-white opacity-[0.03] pointer-events-none select-none z-0">
          @
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6">Let's Build Something.</h2>
            <p className="font-sans text-xl text-ink-faint mb-16">
              Available for freelance, collaborations, and full-time opportunities.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-20">
              <a href="mailto:abdo722005eslam@gmail.com" className="flex items-center gap-3 font-sans text-lg hover:text-ink-faint transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-ink transition-colors">
                  <Mail size={20} />
                </div>
                abdo722005eslam@gmail.com
              </a>
              <div className="flex items-center gap-3 font-sans text-lg text-white">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                +20 01022543918
              </div>
            </div>

            <div className="flex justify-center gap-6 mb-24">
              <a href="https://github.com/Abdelrahman-Eslam-Abdelrazek" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-ink transition-all transform hover:-translate-y-1">
                <Github size={24} />
              </a>
              <a href="#" className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-ink transition-all transform hover:-translate-y-1 font-serif font-bold text-xl italic">
                f
              </a>
              <a href="#" className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-ink transition-all transform hover:-translate-y-1 font-serif font-bold text-xl">
                ig
              </a>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 text-center font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} Abdelrahman Eslam Abdelrazek — Designed & Built in Cairo 🇪🇬
        </div>
      </section>
    </div>
  );
}
