/* Shared header + footer for non-home pages.
   Pages declare data-page="<slug>" on body to mark active nav.
   Inject by calling buildChrome() — done automatically when this script runs. */
(function () {
  const NAV = [
    ['index.html',   'Home',     'home'],
    ['team.html',    'Team',     'team'],
    ['outreach.html','Outreach', 'outreach'],
    ['sponsors.html','Sponsors', 'sponsors'],
    ['blog.html',    'Blog',     'blog'],
    ['contact.html', 'Join',     'contact'],
  ];
  function build() {
    const page = document.body.dataset.page || '';
    // Top banner (above header)
    const banner = document.createElement('div');
    banner.className = 'site-banner';
    banner.innerHTML = `<a href="index.html" aria-label="Superconducktors home"><img src="assets/banner.png" alt="The Superconducktors · Team 60317" /></a>`;
    document.body.insertBefore(banner, document.body.firstChild);
    // Header
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="site-header__inner">
        <nav class="nav" aria-label="Primary">
          ${NAV.map(([h,l,s]) => `<a href="${h}" class="${s===page?'active':''}">${l}</a>`).join('')}
        </nav>
        <a href="https://www.firstinspires.org/" class="first-logo-link" target="_blank" rel="noopener noreferrer">
          <img src="assets/FIRST_Horz_RGB.jpg" alt="FIRST Inspires" class="first-logo" />
        </a>
        <div class="header-actions">
          <button class="icon-btn night-toggle" aria-label="Toggle night mode">☾</button>
          <button class="icon-btn menu-toggle" aria-label="Toggle menu">☰</button>
        </div>
      </div>`;
    document.body.insertBefore(header, document.body.firstChild);

    // Footer
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="site-footer__inner">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Super<span>conduck</span>tors</div>
            <p class="footer-tagline">Team 60317 · FIRST Tech Challenge rookie season 2026.
              Building engineers, mentoring teams, spreading the spark.</p>
          </div>
          <div><h4>Explore</h4><ul>
            <li><a href="team.html">Team</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="contact.html">Join</a></li>
            <li><a href="outreach.html">Outreach</a></li>
          </ul></div>
          <div><h4>More</h4><ul>
            <li><a href="outreach.html">Outreach</a></li>
            <li><a href="sponsors.html">Sponsors</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul></div>
          <div><h4>Get in touch</h4><ul>
            <li><a href="contact.html">hello@team60317.org</a></li>
            <li><a href="contact.html">@superconducktors</a></li>
            <li><a href="contact.html">Sponsor inquiries</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Superconducktors · FTC Team 60317</span>
          <span>QUACK · QUACK · QUACK</span>
        </div>
      </div>`;
    document.body.appendChild(footer);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
