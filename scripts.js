/**
 * Logika JavaScript dla Świątecznego Śpiewnika.
 */

// 1. ZARZĄDZANIE ŚNIEGIEM (Ukrywanie przy czytaniu kolędy)

// Pobieramy elementy DOM po ich ID
const details = document.getElementById('carolDetails');
const snowContainer = document.getElementById('snow');

// Nasłuchujemy na zdarzenie 'toggle' elementu <details>
details.addEventListener('toggle', (event) => {
    // Właściwość .open jest true, jeśli sekcja jest rozwinięta
    if (details.open) {
        // Jeśli otwarte -> ukryj śnieg, dodając klasę CSS 'snow-hidden'
        snowContainer.classList.add('snow-hidden');
    } else {
        // Jeśli zamknięte -> pokaż śnieg, usuwając klasę CSS 'snow-hidden'
        snowContainer.classList.remove('snow-hidden');
    }
});


// 2. BLOKADA WYGASZANIA EKRANU (Wake Lock API)
// Zapobiega wyłączaniu się ekranu, gdy użytkownik czyta tekst.

let wakeLock = null;
const wakeLockStatusElement = document.getElementById('wakeLockStatus');

/**
 * Prosi przeglądarkę o blokadę wygaszania ekranu.
 */
async function requestWakeLock() {
    // Sprawdzamy, czy API jest dostępne w przeglądarce
    if ('wakeLock' in navigator) {
        try {
            // Wymaga to uprawnienia użytkownika (zazwyczaj jest automatyczne po kliknięciu/dotknięciu)
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Blokada ekranu aktywna.");
            // Opcjonalnie aktualizujemy status widoczny dla użytkownika
            if (wakeLockStatusElement) {
                wakeLockStatusElement.textContent = '💡 Ekran pozostanie włączony';
            }
            
            // Reagujemy na zwolnienie blokady przez system/przeglądarkę
            wakeLock.addEventListener('release', () => {
                console.log("Blokada ekranu zwolniona.");
                if (wakeLockStatusElement) {
                    wakeLockStatusElement.textContent = 'Ekran może się wygasić';
                }
                wakeLock = null;
            });
            
        } catch (err) { 
            console.warn(`Błąd żądania blokady ekranu: ${err.name}, ${err.message}`);
            if (wakeLockStatusElement) {
                wakeLockStatusElement.textContent = 'Brak blokady ekranu';
            }
        }
    } else {
        if (wakeLockStatusElement) {
            wakeLockStatusElement.textContent = 'Brak obsługi blokady ekranu';
        }
    }
}

// Ponawiamy próbę uzyskania blokady, jeśli użytkownik wraca na stronę (np. przełącza zakładki)
document.addEventListener('visibilitychange', async () => {
    // Jeśli blokada została zwolniona i strona jest widoczna, próbujemy ją przywrócić
    if (wakeLock === null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// Zaczynamy od razu po załadowaniu skryptu/strony, ale często Wake Lock API wymaga interakcji użytkownika.
// Dodajemy więc też nasłuch na kliknięcie jako zapas, jeśli pierwsza próba zawiedzie.
document.addEventListener('click', () => {
    if (!wakeLock) {
        requestWakeLock();
    }
});

function createSnowflakes() {
    const container = document.getElementById('snow');
    const snowflakeCount = 10; // Ilość płatków - bezpieczna liczba dla telefonów
    const characters = ['❄', '•', '❅', '❆']; // Różne kształty

    for (let i = 0; i < snowflakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        
        // Losujemy wygląd płatka
        flake.innerHTML = characters[Math.floor(Math.random() * characters.length)];
        
        // Losujemy pozycję startową w poziomie (0% - 100%)
        flake.style.left = Math.random() * 100 + '%';
        
        // Losujemy czas spadania (od 8s do 18s) - wolniej = bardziej nastrojowo
        const duration = Math.random() * 15 + 10; 
        flake.style.animationDuration = duration + 's';
        
        // Losujemy opóźnienie startu, żeby nie spadły wszystkie naraz
        // Ujemne opóźnienie sprawia, że animacja jest już "w trakcie" po załadowaniu strony
        flake.style.animationDelay = (Math.random() * 20 * -1) + 's';
        
        // Losujemy wielkość (0.8 do 1.5 em)
        const size = 0.7;
        flake.style.fontSize = size + 'em';
        
        // Losujemy przezroczystość
        flake.style.opacity = Math.random() * 0.5 + 0.3;

        container.appendChild(flake);
    }
}
document.addEventListener('DOMContentLoaded', createSnowflakes);
// Pierwsza próba żądania blokady po załadowaniu strony
requestWakeLock();
