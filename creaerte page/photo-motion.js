(() => {
        // Parallax de las fotos al hacer scroll; la grilla móvil permanece estable.
        const photoGroups = [...document.querySelectorAll('.about-spread-media, .scrapbook-container, [data-motion-group]')]
            .map(container => ({ container, photos: container.querySelectorAll('[data-parallax]') }));
        const photoMotion = window.matchMedia('(min-width: 1201px) and (prefers-reduced-motion: no-preference)');
        let photoFrame = null;

        function updatePhotoParallax() {
            photoFrame = null;
            if (!photoMotion.matches) {
                photoGroups.forEach(group => group.photos.forEach(photo => photo.style.removeProperty('--parallax-y')));
                return;
            }

            photoGroups.forEach(({ container, photos }) => {
                const bounds = container.getBoundingClientRect();
                if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100) return;
                const distance = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
                photos.forEach(photo => {
                    const offset = Math.max(-56, Math.min(56, distance * Number(photo.dataset.parallax)));
                    photo.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
                });
            });
        }

        function requestPhotoParallax() {
            if (photoFrame === null) photoFrame = requestAnimationFrame(updatePhotoParallax);
        }

        window.addEventListener('scroll', requestPhotoParallax, { passive: true });
        window.addEventListener('resize', requestPhotoParallax);
        photoMotion.addEventListener('change', requestPhotoParallax);
        requestPhotoParallax();

        // Repulsión suave cerca del cursor, con regreso progresivo al salir.
        const photoHoverMotion = window.matchMedia('(min-width: 1201px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const floatingPhotos = new Map();
        let floatFrame = null;

        function animateFloatingPhotos() {
            floatFrame = null;
            let moving = false;
            floatingPhotos.forEach((state, photo) => {
                state.x += (state.targetX - state.x) * 0.1;
                state.y += (state.targetY - state.y) * 0.1;
                if (Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) < 0.02) {
                    state.x = state.targetX;
                    state.y = state.targetY;
                } else {
                    moving = true;
                }
                photo.style.setProperty('--float-x', `${state.x.toFixed(2)}px`);
                photo.style.setProperty('--float-y', `${state.y.toFixed(2)}px`);
            });
            if (moving) floatFrame = requestAnimationFrame(animateFloatingPhotos);
        }

        function requestPhotoFloat() {
            if (floatFrame === null) floatFrame = requestAnimationFrame(animateFloatingPhotos);
        }

        photoGroups.forEach(({ container, photos: groupPhotos }) => {
            const photos = [...groupPhotos].filter(photo => photo.dataset.cursorFloat !== 'false');
            if (!photos.length) return;
            photos.forEach(photo => floatingPhotos.set(photo, { x: 0, y: 0, targetX: 0, targetY: 0 }));
            container.addEventListener('pointermove', event => {
                if (!photoHoverMotion.matches || event.pointerType === 'touch') return;
                photos.forEach(photo => {
                    const state = floatingPhotos.get(photo);
                    const bounds = photo.getBoundingClientRect();
                    // Restar el desplazamiento evita que la propia animación altere el objetivo.
                    const dx = bounds.left + bounds.width / 2 - state.x - event.clientX;
                    const dy = bounds.top + bounds.height / 2 - state.y - event.clientY;
                    const distance = Math.hypot(dx, dy);
                    const radius = Math.max(bounds.width, bounds.height) * 0.7;
                    const force = 38 * Math.max(0, 1 - distance / radius);
                    state.targetX = distance > 1 ? dx / distance * force : 0;
                    state.targetY = distance > 1 ? dy / distance * force : -force;
                });
                requestPhotoFloat();
            }, { passive: true });
            container.addEventListener('pointerleave', () => {
                photos.forEach(photo => {
                    const state = floatingPhotos.get(photo);
                    state.targetX = 0;
                    state.targetY = 0;
                });
                requestPhotoFloat();
            });
        });

        photoHoverMotion.addEventListener('change', () => {
            if (floatFrame !== null) cancelAnimationFrame(floatFrame);
            floatFrame = null;
            floatingPhotos.forEach((state, photo) => {
                state.x = state.y = state.targetX = state.targetY = 0;
                photo.style.removeProperty('--float-x');
                photo.style.removeProperty('--float-y');
            });
        });

})();
