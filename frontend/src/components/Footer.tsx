import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                IB
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Intern<span className="text-primary">Beacon</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of talent by connecting students with the world's most innovative companies.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">For Students</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Browse Internships</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">Student Profile</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">For Companies</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/post" className="hover:text-primary transition-colors">Post an Internship</Link></li>
              <li><Link href="/hiring" className="hover:text-primary transition-colors">Hiring Solutions</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2024 InternBeacon. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
