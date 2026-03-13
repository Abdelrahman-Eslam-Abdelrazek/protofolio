import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
        <div style={{ transform: "translateZ(30px)" }}>
          <div className="text-[80px] md:text-[100px] leading-none text-off-white font-display font-bold select-none mb-4 transition-colors group-hover:text-border">
            {project.id}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-4">{project.title}</h3>
          
          {project.status && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-off-white border border-border rounded-sm text-xs font-mono mb-4 text-ink-muted">
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
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
      {/* --- HERO SECTION --- */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden bg-white bg-dot-grid"
      >
        <div className="absolute bottom-[-5%] right-0 md:right-10 text-[180px] md:text-[350px] leading-none text-off-white font-display pointer-events-none select-none z-0">
          01
        </div>

        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative inline-block mb-2 md:mb-0"
            >
              {/* Back Layer Shadow */}
              <span 
                className="absolute top-0 left-0 font-display text-[15vw] md:text-9xl text-ink-faint leading-[0.85] md:leading-[0.85] tracking-tight -z-10 w-full"
                style={{ transform: `translate3d(${heroMousePos.x * 8}px, ${heroMousePos.y * 8 + 4}px, 0)` }}
              >
                ABDELRAHMAN ESLAM
              </span>
              {/* Front Layer */}
              <span 
                className="relative font-display text-[15vw] md:text-9xl text-ink leading-[0.85] md:leading-[0.85] tracking-tight z-10 w-full inline-block"
                style={{ transform: `translate3d(${heroMousePos.x * -4}px, ${heroMousePos.y * -4}px, 0)` }}
              >
                ABDELRAHMAN ESLAM
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.4 }}
            >
              <div 
                className="font-display text-[15vw] md:text-9xl text-outline leading-[0.85] md:leading-[0.85] tracking-tight"
                style={{ transform: `translate3d(${heroMousePos.x * -2}px, ${heroMousePos.y * -2}px, 0)` }}
              >
                ABDELRAZEK
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 mb-12 flex flex-col gap-4"
            >
              <div className="font-sans text-xl md:text-2xl text-ink-muted">
                <Typewriter />
              </div>
              <div className="flex items-center gap-2 text-sm font-mono font-medium text-ink bg-off-white w-fit px-3 py-1.5 border border-border">
                <MapPin size={14} /> Cairo, Egypt
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#projects" 
                className="px-8 py-4 bg-ink text-white font-sans font-bold text-center border border-ink hover:bg-white hover:text-ink transition-all duration-300 transform hover:-translate-y-1 hover:shadow-deep"
              >
                View My Work
              </a>
              <a 
                href="https://github.com/Abdelrahman-Eslam-Abdelrazek/egyramadan1" 
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-white text-ink font-sans font-bold text-center border border-ink hover:bg-off-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-soft flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download CV
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 md:py-32 bg-off-white relative border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <ScrollReveal>
              <p className="font-mono text-sm tracking-widest text-ink-muted uppercase mb-6">About</p>
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
      <section id="skills" className="py-24 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-20">Technical Arsenal</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 perspective-1000" style={{ perspective: "1000px" }}>
            {/* Column 1 */}
            <ScrollReveal delay={0.1}>
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
            <ScrollReveal delay={0.2}>
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
            <ScrollReveal delay={0.3}>
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
