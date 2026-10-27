(() => {
    const main = document.getElementById('contenido-principal');
    if (!main) return;

    // Cada sección calcula su parallax con el mismo motor que Quiénes Somos.
    main.querySelectorAll('section').forEach(section => {
        const photos = section.querySelectorAll('.viajes-media, .noches-media, .ed-card, .h-gallery-item, .video-container');
        if (!photos.length) return;
        section.setAttribute('data-motion-group', '');
        photos.forEach((photo, index) => {
            photo.classList.add('motion-photo');
            photo.dataset.parallax = [0.08, 0.14, -0.1][index % 3];
            photo.dataset.cursorFloat = photo.matches('.ed-card') ? 'true' : 'false';
        });
    });

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px' });

    function reveal(element, kind, delay = 0) {
        element.dataset.entry = kind;
        element.style.setProperty('--entry-delay', `${delay}ms`);
        element.classList.add('motion-entry');
        observer.observe(element);
    }

    main.querySelectorAll('section').forEach(section => reveal(section, 'section'));
    main.querySelectorAll('h2').forEach(heading => reveal(heading, 'zoom', 100));
    main.querySelectorAll('h3, .viajes-p, .narrative-p').forEach(text => reveal(text, 'right', 180));
    main.querySelectorAll('.motion-photo').forEach((photo, index) => reveal(photo, 'up', (index % 3) * 120));
})();
