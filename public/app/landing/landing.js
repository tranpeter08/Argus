const aboutSection = `
  <section class="landing-about" role="region">
    <div class="about-ctnr">
      <h1>About</h1>
      <p> 
        Argus is a web application geared towards small inspection 
        companies in the construction industry specializing in structural
        steel, concrete, soils, and Non-destructive Testing.  
        Easily create, view, and edit employee information, equipment and 
        certifications.
      </p>
    </div>
  </section>
`;

function renderLanding() {
  history.pushState({}, 'About', '/');
  $('#root').html(aboutSection);
}

$();