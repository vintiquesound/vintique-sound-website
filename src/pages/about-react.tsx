import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Award, Music, Headphones, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const achievements = [
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: Music, number: "500+", label: "Projects Completed" },
    { icon: Headphones, number: "50+", label: "Chart Hits" },
    { icon: GraduationCap, number: "10K+", label: "Students Taught" }
  ];

  const credentials = [
    "Grammy-nominated Engineer",
    "Berklee College of Music Graduate",
    "Multi-Platinum Certified",
    "Mix & Mastering Specialist",
    "Dolby Atmos Certified",
    "Audio Engineering Society Member"
  ];

  const experience = [
    {
      year: "2020 - Present",
      title: "Founder & Lead Engineer",
      company: "SoundForge Studio",
      description: "Established full-service audio production facility, specializing in mixing, mastering, and audio education."
    },
    {
      year: "2015 - 2020",
      title: "Senior Mix Engineer",
      company: "Electric Lady Studios",
      description: "Worked with major label artists, engineered multiple platinum records, and contributed to Grammy-winning albums."
    },
    {
      year: "2010 - 2015",
      title: "Assistant Engineer",
      company: "Capitol Studios",
      description: "Learned from industry legends, assisted on high-profile sessions, and developed expertise in analog gear."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary">About</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Marcus Chen
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                With over 15 years in the music industry, I've dedicated my career to helping artists achieve their sonic vision. From Grammy-nominated albums to emerging artists' debut tracks, every project receives the same level of passion and precision.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                My approach combines cutting-edge technology with timeless techniques, ensuring your music sounds incredible on any platform, from streaming services to vinyl.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1664817717775-956820aa14e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMG1peGluZ3xlbnwxfHx8fDE3NjcxMTg0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Marcus Chen at work"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                    <div className="text-sm text-muted-foreground">{achievement.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Credentials & Certifications</h2>
              <p className="text-lg text-muted-foreground">
                Professional qualifications and industry recognition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((credential, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg border-2 hover:border-secondary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-medium">{credential}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Journey</h2>
              <p className="text-lg text-muted-foreground">
                A career built on passion and dedication
              </p>
            </div>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-primary pb-8 last:pb-0">
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-primary border-4 border-background" />
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">{exp.year}</Badge>
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <p className="text-secondary font-medium mb-2">{exp.company}</p>
                  </div>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">My Philosophy</h2>
            <p className="text-lg text-muted-foreground mb-6">
              "Great audio engineering isn't just about technical perfection—it's about understanding the artist's vision and bringing it to life. Every mix tells a story, and my job is to make sure that story is heard exactly as intended."
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              I believe in continuous learning, staying current with technology while respecting the timeless principles that have defined great recordings for decades. Whether working with emerging artists or established names, I approach each project with fresh ears and unwavering dedication.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Let's Work Together
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
