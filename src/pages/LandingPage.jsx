/* =========================================================
   PHILALINK LANDING PAGE
========================================================= */

.landing-page {
  width: 100%;
  min-width: 0;

  min-height: 100vh;
  min-height: 100dvh;

  overflow-x: hidden;

  background: #ffffff;
  color: #0f172a;

  font-family:
    "Inter",
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.landing-page *,
.landing-page *::before,
.landing-page *::after {
  box-sizing: border-box;
}

.landing-page img {
  display: block;

  max-width: 100%;
}


/* =========================================================
   SHARED
========================================================= */

.section-container {
  width:
    min(
      1180px,
      calc(100% - 48px)
    );

  margin-inline: auto;
}

.section-label,
.footer-label {
  display: inline-flex;
  align-items: center;

  color: #0f766e;

  font-size: 0.7rem;
  font-weight: 800;

  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.section-heading {
  max-width: 720px;

  margin-bottom: 44px;
}

.section-heading-centered {
  margin-right: auto;
  margin-left: auto;

  text-align: center;
}

.section-heading h2,
.intro-heading h2 {
  margin:
    14px 0 0;

  color: #0f172a;

  font-size:
    clamp(
      2rem,
      4vw,
      3.2rem
    );

  font-weight: 800;
  line-height: 1.1;

  letter-spacing:
    -0.045em;
}

.section-heading h2 span,
.intro-heading h2 span {
  color: #0f766e;
}

.section-heading p {
  max-width: 660px;

  margin:
    18px 0 0;

  color: #64748b;

  font-size: 0.97rem;
  line-height: 1.8;
}

.section-heading-centered p {
  margin-right: auto;
  margin-left: auto;
}


/* =========================================================
   HERO

   IMAGE + TEXT ONLY
========================================================= */

.landing-hero {
  position: relative;

  isolation: isolate;

  display: flex;
  align-items: center;

  width: 100%;

  min-height:
    clamp(
      620px,
      82vh,
      800px
    );

  padding:
    120px 0
    70px;

  overflow: hidden;

  background: #043f3d;
}


/* Background image */

.landing-hero::before {
  position: absolute;
  z-index: -3;

  inset: -8px;

  background-image:
    var(--hero-image);

  background-repeat:
    no-repeat;

  background-position:
    center center;

  background-size:
    cover;

  filter:
    blur(2px);

  transform:
    scale(1.02);

  content: "";
}


/* Overlay for readability */

.landing-hero::after {
  position: absolute;
  z-index: -2;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(
        3,
        43,
        42,
        0.88
      )
      0%,

      rgba(
        4,
        55,
        52,
        0.78
      )
      34%,

      rgba(
        4,
        55,
        52,
        0.46
      )
      65%,

      rgba(
        3,
        43,
        42,
        0.2
      )
      100%
    );

  content: "";
}


/* =========================================================
   HERO TEXT
========================================================= */

.hero-layout {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;

  width: 100%;
}

.hero-content {
  width:
    min(
      100%,
      720px
    );
}

.hero-content h1 {
  max-width: 720px;

  margin: 0;

  color: #ffffff;

  font-size:
    clamp(
      3.2rem,
      6.5vw,
      6rem
    );

  font-weight: 800;
  line-height: 0.98;

  letter-spacing:
    -0.06em;

  text-wrap: balance;
}

.hero-content h1 span {
  color: #99f6e4;
}

.hero-description {
  max-width: 650px;

  margin:
    28px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.88
    );

  font-size:
    clamp(
      1rem,
      1.6vw,
      1.16rem
    );

  line-height: 1.75;
}


/* =========================================================
   ABOUT
========================================================= */

.intro-section {
  padding:
    clamp(
      76px,
      8vw,
      104px
    )
    0;

  background: #ffffff;
}

.intro-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 0.9fr)
    minmax(0, 1.1fr);

  align-items: start;

  gap:
    clamp(
      42px,
      7vw,
      90px
    );
}

.intro-heading {
  max-width: 560px;
}

.intro-copy {
  padding-top: 28px;
}

.intro-copy p {
  margin: 0;

  color: #64748b;

  font-size: 0.98rem;
  line-height: 1.85;
}

.intro-copy p + p {
  margin-top: 18px;
}


/* =========================================================
   CARE SUMMARY
========================================================= */

.care-summary-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 18px;

  margin-top: 66px;
}

.care-summary-card {
  min-width: 0;
  min-height: 240px;

  padding: 27px;

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.care-summary-card:hover {
  border-color: #99f6e4;

  box-shadow:
    0 18px 46px
    rgba(
      15,
      23,
      42,
      0.07
    );

  transform:
    translateY(-3px);
}

.care-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
}

.care-summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 47px;
  height: 47px;

  flex-shrink: 0;

  border-radius: 14px;

  background: #f0fdfa;
  color: #0f766e;
}

.care-summary-header > span {
  color: #cbd5e1;

  font-size: 0.78rem;
  font-weight: 800;
}

.care-summary-card h3 {
  margin:
    30px 0 0;

  color: #0f172a;

  font-size: 1.06rem;
  font-weight: 750;
}

.care-summary-card p {
  margin:
    12px 0 0;

  color: #64748b;

  font-size: 0.82rem;
  line-height: 1.75;
}


/* =========================================================
   SERVICES
========================================================= */

.services-section {
  padding:
    clamp(
      76px,
      8vw,
      104px
    )
    0;

  background: #f8fafc;
}

.services-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 18px;
}

.service-card {
  min-width: 0;
  min-height: 270px;

  padding: 27px;

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;

  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.service-card:hover {
  border-color: #99f6e4;

  box-shadow:
    0 18px 40px
    rgba(
      15,
      23,
      42,
      0.06
    );

  transform:
    translateY(-4px);
}

.service-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
}

.service-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  flex-shrink: 0;

  border-radius: 14px;

  background: #f0fdfa;
  color: #0f766e;
}

.service-arrow {
  color: #cbd5e1;
}

.service-card h3 {
  margin:
    30px 0 0;

  color: #0f172a;

  font-size: 1rem;
  font-weight: 750;
}

.service-card p {
  margin:
    12px 0 0;

  color: #64748b;

  font-size: 0.82rem;
  line-height: 1.75;
}


/* =========================================================
   CARE BANNER
========================================================= */

.care-banner-section {
  padding:
    36px 0
    104px;

  background: #f8fafc;
}

.care-banner {
  display: grid;

  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 28px;

  padding:
    38px 40px;

  border-radius: 24px;

  background:
    linear-gradient(
      135deg,
      #064e4b,
      #0f766e
    );
}

.care-banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 62px;
  height: 62px;

  border-radius: 18px;

  background:
    rgba(
      255,
      255,
      255,
      0.1
    );

  color: #99f6e4;
}

.care-banner-copy > span {
  color: #99f6e4;

  font-size: 0.66rem;
  font-weight: 800;

  letter-spacing: 0.13em;
}

.care-banner-copy h2 {
  margin:
    9px 0 0;

  color: #ffffff;

  font-size:
    clamp(
      1.5rem,
      3vw,
      2.25rem
    );

  font-weight: 800;
}

.care-banner-copy p {
  max-width: 670px;

  margin:
    11px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.66
    );

  font-size: 0.81rem;
  line-height: 1.7;
}

.care-banner-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 48px;

  padding:
    0 20px;

  border-radius: 10px;

  background: #ffffff;
  color: #0f766e;

  font-size: 0.8rem;
  font-weight: 750;

  text-decoration: none;
}


/* =========================================================
   HEALTH TIPS
========================================================= */

.health-tips-section {
  padding:
    clamp(
      76px,
      8vw,
      104px
    )
    0;

  background: #ffffff;
}

.health-tips-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 18px;
}

.health-tip-card {
  position: relative;

  min-width: 0;
  min-height: 255px;

  padding: 28px;

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  background: #ffffff;
}

.health-tip-number {
  position: absolute;

  top: 22px;
  right: 24px;

  color: #e2e8f0;

  font-size: 1.25rem;
  font-weight: 800;
}

.health-tip-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 47px;
  height: 47px;

  border-radius: 14px;

  background: #ecfdf5;
  color: #047857;
}

.health-tip-card h3 {
  margin:
    28px 0 0;

  color: #0f172a;

  font-size: 1rem;
  font-weight: 750;
}

.health-tip-card p {
  margin:
    12px 0 0;

  color: #64748b;

  font-size: 0.81rem;
  line-height: 1.75;
}


/* =========================================================
   FOOTER
========================================================= */

.landing-footer {
  background: #073b3b;
  color: #ffffff;
}

.footer-cta {
  display: grid;

  grid-template-columns:
    minmax(0, 1.3fr)
    minmax(260px, 0.7fr);

  align-items: end;

  gap: 40px;

  padding:
    80px 0
    60px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.1
    );
}

.footer-label {
  color: #5eead4;
}

.footer-cta h2 {
  margin:
    14px 0 0;

  color: #ffffff;

  font-size:
    clamp(
      2rem,
      4vw,
      3.2rem
    );

  font-weight: 800;
}

.footer-cta h2 span {
  color: #5eead4;
}

.footer-cta p {
  max-width: 650px;

  margin:
    18px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.65
    );

  line-height: 1.8;
}

.footer-cta-actions {
  display: flex;

  gap: 10px;

  justify-content: flex-end;
}

.footer-primary-button,
.footer-secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 48px;

  padding:
    0 19px;

  border-radius: 9px;

  font-size: 0.8rem;
  font-weight: 700;

  text-decoration: none;
}

.footer-primary-button {
  background: #ffffff;
  color: #0f766e;
}

.footer-secondary-button {
  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.22
    );

  color: #ffffff;
}

.footer-main {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1.8fr);

  gap: 80px;

  padding:
    58px 0;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.1
    );
}

.footer-logo {
  display: inline-flex;
  align-items: center;

  gap: 11px;

  color: #ffffff;

  text-decoration: none;
}

.footer-logo img {
  width: 44px;
  height: 44px;

  object-fit: contain;
}

.footer-logo span {
  font-size: 1.45rem;
  font-weight: 800;
}

.footer-logo strong {
  color: #5eead4;
}

.footer-brand h3 {
  margin:
    22px 0 0;

  color: #ffffff;
}

.footer-brand p {
  max-width: 420px;

  margin:
    14px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.62
    );

  font-size: 0.8rem;
  line-height: 1.8;
}

.footer-links-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 34px;
}

.footer-links-grid h4 {
  margin: 0;

  font-size: 0.73rem;

  text-transform: uppercase;
}

.footer-links {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin-top: 18px;
}

.footer-links a {
  color:
    rgba(
      255,
      255,
      255,
      0.62
    );

  font-size: 0.78rem;

  text-decoration: none;
}

.support-list {
  display: grid;

  gap: 18px;

  margin-top: 18px;
}

.support-item {
  display: flex;

  gap: 11px;
}

.support-item > svg {
  color: #5eead4;
}

.support-item span {
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );

  font-size: 0.65rem;

  text-transform: uppercase;
}

.support-item p {
  margin:
    4px 0 0;

  color:
    rgba(
      255,
      255,
      255,
      0.68
    );

  font-size: 0.76rem;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding:
    24px 0
    30px;

  color:
    rgba(
      255,
      255,
      255,
      0.5
    );

  font-size: 0.7rem;
}

.footer-bottom-right,
.footer-emergency {
  display: flex;
  align-items: center;
}

.footer-bottom-right {
  gap: 20px;
}

.footer-emergency {
  gap: 7px;
}

.footer-emergency svg {
  color: #5eead4;
}

.footer-emergency strong {
  color: #ffffff;
}

.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border: 0;
  border-radius: 50%;

  background: #0f766e;
  color: #ffffff;

  cursor: pointer;
}


/* =========================================================
   LARGE SCREENS
========================================================= */

@media (
  min-width: 1600px
) {
  .section-container {
    width:
      min(
        1240px,
        calc(100% - 96px)
      );
  }

  .landing-hero {
    min-height: 840px;
  }

  .hero-content {
    width: 760px;
  }

  .hero-content h1 {
    font-size: 6rem;
  }
}


/* =========================================================
   LAPTOP
========================================================= */

@media (
  max-width: 1200px
) {
  .section-container {
    width:
      min(
        1100px,
        calc(100% - 48px)
      );
  }

  .landing-hero::before {
    background-position:
      56% center;
  }
}


/* =========================================================
   TABLET LANDSCAPE
========================================================= */

@media (
  max-width: 1024px
) {
  .landing-hero {
    min-height: 700px;

    padding:
      116px 0
      60px;
  }

  .landing-hero::before {
    background-position:
      60% center;
  }

  .landing-hero::after {
    background:
      linear-gradient(
        90deg,
        rgba(
          3,
          43,
          42,
          0.92
        )
        0%,

        rgba(
          3,
          43,
          42,
          0.76
        )
        58%,

        rgba(
          3,
          43,
          42,
          0.39
        )
        100%
      );
  }

  .intro-layout {
    grid-template-columns:
      1fr;

    gap: 28px;
  }

  .intro-copy {
    padding-top: 0;
  }

  .services-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .care-banner {
    grid-template-columns:
      auto
      1fr;
  }

  .care-banner-button {
    grid-column:
      2;
  }

  .footer-main {
    grid-template-columns:
      1fr;

    gap: 46px;
  }
}


/* =========================================================
   TABLET PORTRAIT
========================================================= */

@media (
  max-width: 768px
) {
  .section-container {
    width:
      calc(
        100% - 32px
      );
  }

  .landing-hero {
    min-height: 650px;

    padding:
      112px 0
      52px;
  }

  .landing-hero::before {
    background-position:
      63% center;

    filter:
      blur(1.8px);
  }

  .landing-hero::after {
    background:
      linear-gradient(
        90deg,
        rgba(
          3,
          43,
          42,
          0.91
        )
        0%,

        rgba(
          3,
          43,
          42,
          0.75
        )
        65%,

        rgba(
          3,
          43,
          42,
          0.47
        )
        100%
      );
  }

  .hero-content {
    max-width: 590px;
  }

  .hero-content h1 {
    font-size:
      clamp(
        3rem,
        12vw,
        4.4rem
      );
  }

  .care-summary-grid,
  .services-grid,
  .health-tips-grid {
    grid-template-columns:
      1fr;
  }

  .care-summary-card,
  .service-card,
  .health-tip-card {
    min-height: 0;
  }

  .care-banner {
    grid-template-columns:
      1fr;

    padding:
      30px 26px;
  }

  .care-banner-button {
    grid-column: auto;

    justify-self: start;
  }

  .footer-cta {
    grid-template-columns:
      1fr;

    gap: 28px;
  }

  .footer-cta-actions {
    justify-content:
      flex-start;
  }

  .footer-links-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 520px
) {
  .section-container {
    width:
      calc(
        100% - 24px
      );
  }

  .landing-hero {
    min-height: 600px;

    padding:
      104px 0
      44px;
  }

  .landing-hero::before {
    background-position:
      65% center;

    filter:
      blur(1.6px);
  }

  .hero-content h1 {
    font-size:
      clamp(
        2.6rem,
        14vw,
        3.5rem
      );
  }

  .hero-description {
    margin-top: 22px;

    font-size: 0.94rem;
  }

  .footer-links-grid {
    grid-template-columns:
      1fr;
  }

  .footer-cta-actions {
    flex-direction:
      column;
  }

  .footer-primary-button,
  .footer-secondary-button {
    width: 100%;
  }

  .footer-bottom {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .footer-bottom-right {
    width: 100%;

    justify-content:
      space-between;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (
  max-width: 375px
) {
  .section-container {
    width:
      calc(
        100% - 20px
      );
  }

  .landing-hero {
    min-height: 560px;

    padding-top: 98px;
  }

  .hero-content h1 {
    font-size: 2.55rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .care-summary-card,
  .service-card,
  .health-tip-card {
    padding: 21px;
  }
}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (
  max-width: 320px
) {
  .section-container {
    width:
      calc(
        100% - 16px
      );
  }

  .hero-content h1 {
    font-size: 2.25rem;
  }

  .hero-description {
    font-size: 0.86rem;
  }
}


/* =========================================================
   SHORT / LANDSCAPE SCREENS
========================================================= */

@media (
  max-height: 600px
) and (
  min-width: 600px
) {
  .landing-hero {
    min-height: 560px;

    padding:
      100px 0
      40px;
  }

  .hero-content h1 {
    font-size:
      clamp(
        2.8rem,
        7vw,
        4.2rem
      );
  }

  .hero-description {
    margin-top: 18px;
  }
}


/* =========================================================
   TOUCH DEVICES
========================================================= */

@media (
  hover: none
) {
  .service-card:hover,
  .care-summary-card:hover {
    transform: none;

    box-shadow: none;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion:
    reduce
) {
  .service-card,
  .care-summary-card {
    transition: none;
  }
}
