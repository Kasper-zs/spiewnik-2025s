/**
 * Logika JavaScript dla Świątecznego Śpiewnika.
 */

// 1. ZARZĄDZANIE ŚNIEGIEM (Ukrywanie przy czytaniu kolędy)

// Pobieramy WSZYSTKIE elementy <details> (kolędy), a nie tylko jeden po ID
const allDetails = document.querySelectorAll('details');
const snowContainer = document.getElementById('snow');

// Dla każdej kolędy dodajemy nasłuchiwanie otwarcia/zamknięcia
allDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
        // Sprawdzamy, czy którakolwiek kolęda jest otwarta
        // (zamieniamy NodeList na Array, żeby użyć funkcji .some)
        const isAnyOpen = Array.from(allDetails).some(d => d.open);

        if (isAnyOpen) {
            // Jeśli coś jest otwarte -> ukryj śnieg
            snowContainer.classList.add('snow-hidden');
        } else {
            // Jeśli wszystko zamknięte -> pokaż śnieg
            snowContainer.classList.remove('snow-hidden');
        }
    });
});


// 2. PRZYCISKI "ZWIŃ TEKST" (To naprawia Twój główny problem)

const closeButtons = document.querySelectorAll('.btn-close-lyrics');

closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Zapobiegamy standardowym akcjom (dla pewności)
        e.preventDefault(); 

        // 1. Znajdź najbliższy element nadrzędny <details>
        const detailsElement = button.closest('details');
        
        if (detailsElement) {
            // 2. Zamknij go (usuwając atrybut open)
            detailsElement.removeAttribute('open');
            
            // 3. Płynnie wróć do nagłówka tej kolędy
            detailsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});


// 3. BLOKADA WYGASZANIA EKRANU (Wake Lock API)

let wakeLock = null;
const wakeLockStatusElement = document.getElementById('wakeLockStatus');

async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Blokada ekranu aktywna.");
            if (wakeLockStatusElement) wakeLockStatusElement.textContent = '💡 Ekran pozostanie włączony';
            
            wakeLock.addEventListener('release', () => {
                console.log("Blokada ekranu zwolniona.");
                if (wakeLockStatusElement) wakeLockStatusElement.textContent = 'Ekran może się wygasić';
                wakeLock = null;
            });
            
        } catch (err) { 
            console.warn(`Błąd żądania blokady ekranu: ${err.name}, ${err.message}`);
        }
    } else {
        if (wakeLockStatusElement) wakeLockStatusElement.textContent = '';
    }
}

document.addEventListener('visibilitychange', async () => {
    if (wakeLock === null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

document.addEventListener('click', () => {
    if (!wakeLock) {
        requestWakeLock();
    }
});


// 4. GENEROWANIE ŚNIEGU

function createSnowflakes() {
    const container = document.getElementById('snow');
    // Sprawdzamy czy kontener istnieje, żeby uniknąć błędów
    if (!container) return;

    const snowflakeCount = 15; // Ilość płatków
    const characters = ['❄', '•', '❅', '❆']; 

    for (let i = 0; i < snowflakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerHTML = characters[Math.floor(Math.random() * characters.length)];
        flake.style.left = Math.random() * 100 + '%';
        const duration = Math.random() * 15 + 10; 
        flake.style.animationDuration = duration + 's';
        flake.style.animationDelay = (Math.random() * 20 * -1) + 's';
        const size = 0.7;
        flake.style.fontSize = size + 'em';
        flake.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(flake);
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    requestWakeLock();
});