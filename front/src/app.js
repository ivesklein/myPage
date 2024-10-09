window.addEventListener('load', () => {
    navigate(); // Handle initial load
    window.addEventListener('hashchange', navigate); // Handle hash change
  });
  
  function navigate() {
    const hash = window.location.hash || '#';
    //hash === '#login'
  }
  
  function loadPage(page) {

  }