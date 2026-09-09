const socialLinks = [
  {
    label: "GitHub",
    url: "https://github.com/sanamcha",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg",
  },
  {
    label: "Facebook",
    url: "https://facebook.com/sanamcha",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
  },
  {
    label: "X",
    url: "https://x.com/san_mhr",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/sanam-maharjan",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
  },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__info">
          <p className="site-footer__eyebrow">Open to work</p>
          <h3>Full-Stack Developer</h3>
          <p>
            I&apos;m looking for a full-stack position where I can build meaningful
            products, collaborate with great teams, and keep growing across both
            frontend and backend development.
          </p>
        </div>

        <div className="site-footer__socials" aria-label="Social links">
          {socialLinks.map(({ label, url, icon }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="site-footer__link"
              aria-label={label}
              title={label}
            >
              <img src={icon} alt={label} className="site-footer__icon" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
