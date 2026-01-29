// Nager.Date API: https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
const HOLIDAYS_API = 'https://date.nager.at/api/v3/PublicHolidays';
const CACHE_KEY_LAST_COUNTRY = 'globalTime_lastCountry';
const CACHE_KEY_HOLIDAYS = 'globalTime_holidays_';

// Unique country codes for global calendar (Nager.Date supported)
function getGlobalCountryCodes() {
    return [...new Set(countries.map(c => c.countryCode).filter(Boolean))];
}

// Country and timezone data with ISO country codes for API
const countries = [
    { name: 'United States (New York)', timezone: 'America/New_York', flag: '🇺🇸', lat: 40.7128, lng: -74.0060, countryCode: 'US' },
    { name: 'United States (Los Angeles)', timezone: 'America/Los_Angeles', flag: '🇺🇸', lat: 34.0522, lng: -118.2437, countryCode: 'US' },
    { name: 'United States (Chicago)', timezone: 'America/Chicago', flag: '🇺🇸', lat: 41.8781, lng: -87.6298, countryCode: 'US' },
    { name: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, countryCode: 'GB' },
    { name: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, countryCode: 'FR' },
    { name: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪', lat: 52.5200, lng: 13.4050, countryCode: 'DE' },
    { name: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹', lat: 41.9028, lng: 12.4964, countryCode: 'IT' },
    { name: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, countryCode: 'ES' },
    { name: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, countryCode: 'JP' },
    { name: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', lat: 39.9042, lng: 116.4074, countryCode: 'CN' },
    { name: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', lat: 28.6139, lng: 77.2090, countryCode: null },
    { name: 'Australia (Sydney)', timezone: 'Australia/Sydney', flag: '🇦🇺', lat: -33.8688, lng: 151.2093, countryCode: 'AU' },
    { name: 'Australia (Melbourne)', timezone: 'Australia/Melbourne', flag: '🇦🇺', lat: -37.8136, lng: 144.9631, countryCode: 'AU' },
    { name: 'Brazil (São Paulo)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -23.5505, lng: -46.6333, countryCode: 'BR' },
    { name: 'Brazil (Rio de Janeiro)', timezone: 'America/Sao_Paulo', flag: '🇧🇷', lat: -22.9068, lng: -43.1729, countryCode: 'BR' },
    { name: 'Canada (Toronto)', timezone: 'America/Toronto', flag: '🇨🇦', lat: 43.6532, lng: -79.3832, countryCode: 'CA' },
    { name: 'Canada (Vancouver)', timezone: 'America/Vancouver', flag: '🇨🇦', lat: 49.2827, lng: -123.1207, countryCode: 'CA' },
    { name: 'Mexico', timezone: 'America/Mexico_City', flag: '🇲🇽', lat: 19.4326, lng: -99.1332, countryCode: 'MX' },
    { name: 'Russia (Moscow)', timezone: 'Europe/Moscow', flag: '🇷🇺', lat: 55.7558, lng: 37.6173, countryCode: 'RU' },
    { name: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷', lat: 37.5665, lng: 126.9780, countryCode: 'KR' },
    { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198, countryCode: 'SG' },
    { name: 'Thailand', timezone: 'Asia/Bangkok', flag: '🇹🇭', lat: 13.7563, lng: 100.5018, countryCode: null },
    { name: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: '🇦🇪', lat: 25.2048, lng: 55.2708, countryCode: null },
    { name: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', lat: -26.2041, lng: 28.0473, countryCode: 'ZA' },
    { name: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, countryCode: 'EG' },
    { name: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷', lat: 41.0082, lng: 28.9784, countryCode: 'TR' },
    { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', lat: -34.6037, lng: -58.3816, countryCode: 'AR' },
    { name: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱', lat: -33.4489, lng: -70.6693, countryCode: 'CL' },
    { name: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿', lat: -36.8485, lng: 174.7633, countryCode: 'NZ' },
    { name: 'Indonesia (Jakarta)', timezone: 'Asia/Jakarta', flag: '🇮🇩', lat: -6.2088, lng: 106.8456, countryCode: 'ID' },
    { name: 'Philippines', timezone: 'Asia/Manila', flag: '🇵🇭', lat: 14.5995, lng: 120.9842, countryCode: 'PH' },
    { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', lat: 3.1390, lng: 101.6869, countryCode: null },
    { name: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', lat: 10.8231, lng: 106.6297, countryCode: 'VN' },
    { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', lat: 24.7136, lng: 46.6753, countryCode: null },
    { name: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', lat: 31.7683, lng: 35.2137, countryCode: null },
    { name: 'Poland', timezone: 'Europe/Warsaw', flag: '🇵🇱', lat: 52.2297, lng: 21.0122, countryCode: 'PL' },
    { name: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱', lat: 52.3676, lng: 4.9041, countryCode: 'NL' },
    { name: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪', lat: 59.3293, lng: 18.0686, countryCode: 'SE' },
    { name: 'Norway', timezone: 'Europe/Oslo', flag: '🇳🇴', lat: 59.9139, lng: 10.7522, countryCode: 'NO' },
    { name: 'Denmark', timezone: 'Europe/Copenhagen', flag: '🇩🇰', lat: 55.6761, lng: 12.5683, countryCode: 'DK' },
    { name: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭', lat: 47.3769, lng: 8.5417, countryCode: 'CH' },
    { name: 'Belgium', timezone: 'Europe/Brussels', flag: '🇧🇪', lat: 50.8503, lng: 4.3517, countryCode: 'BE' },
    { name: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹', lat: 48.2082, lng: 16.3738, countryCode: 'AT' },
    { name: 'Greece', timezone: 'Europe/Athens', flag: '🇬🇷', lat: 37.9838, lng: 23.7275, countryCode: 'GR' },
    { name: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹', lat: 38.7223, lng: -9.1393, countryCode: 'PT' },
    { name: 'Ireland', timezone: 'Europe/Dublin', flag: '🇮🇪', lat: 53.3498, lng: -6.2603, countryCode: 'IE' },
    { name: 'Finland', timezone: 'Europe/Helsinki', flag: '🇫🇮', lat: 60.1699, lng: 24.9384, countryCode: 'FI' },
    { name: 'Czech Republic', timezone: 'Europe/Prague', flag: '🇨🇿', lat: 50.0755, lng: 14.4378, countryCode: 'CZ' },
    { name: 'Hungary', timezone: 'Europe/Budapest', flag: '🇭🇺', lat: 47.4979, lng: 19.0402, countryCode: 'HU' },
    { name: 'Romania', timezone: 'Europe/Bucharest', flag: '🇷🇴', lat: 44.4268, lng: 26.1025, countryCode: 'RO' },
];

let map;
let currentCountry = null;
let timeUpdateInterval = null;
let currentCalendarDate = new Date();
let calendarView = 'country'; // 'country' | 'global'
let holidaysByCountryYear = {}; // in-memory cache: { 'US_2026': [...] }

function init() {
    setupTabs();
    setupMap();
    setupCountryList();
    setupSearch();
    setupCalendar();
    detectMobile();
    restoreLastCountry();
    hideAppLoading();
}

function showAppLoading() {
    const el = document.getElementById('app-loading');
    if (el) el.setAttribute('aria-hidden', 'false');
}

function hideAppLoading() {
    const el = document.getElementById('app-loading');
    if (el) el.setAttribute('aria-hidden', 'true');
}

function showCalendarLoading() {
    const el = document.getElementById('calendar-loading');
    if (el) el.setAttribute('aria-hidden', 'false');
}

function hideCalendarLoading() {
    const el = document.getElementById('calendar-loading');
    if (el) el.setAttribute('aria-hidden', 'true');
}

function restoreLastCountry() {
    try {
        const saved = localStorage.getItem(CACHE_KEY_LAST_COUNTRY);
        if (saved) {
            const country = countries.find(c => c.name === saved);
            if (country) {
                selectCountry(country);
            }
        }
    } catch (e) {
        console.warn('Could not restore last country', e);
    }
}

function saveLastCountry() {
    if (!currentCountry) return;
    try {
        localStorage.setItem(CACHE_KEY_LAST_COUNTRY, currentCountry.name);
    } catch (e) {
        console.warn('Could not save last country', e);
    }
}

function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (!isMobile) {
        document.querySelectorAll('.flag-emoji, .country-item-flag').forEach(el => {
            el.style.display = 'none';
        });
    } else {
        document.querySelectorAll('.flag-emoji, .country-item-flag').forEach(el => {
            el.style.display = '';
        });
    }
}

// Fetch public holidays for a year and country: GET .../PublicHolidays/{year}/{countryCode}
async function fetchHolidays(countryCode, year) {
    if (!countryCode) return [];
    const key = `${countryCode}_${year}`;
    if (holidaysByCountryYear[key]) return holidaysByCountryYear[key];
    const storageKey = CACHE_KEY_HOLIDAYS + key;
    const url = `${HOLIDAYS_API}/${year}/${countryCode}`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            holidaysByCountryYear[key] = data;
            try {
                localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (e) {}
            return data;
        }
    } catch (err) {
        try {
            const cached = localStorage.getItem(storageKey);
            if (cached) return JSON.parse(cached);
        } catch (e) {}
    }
    return [];
}

function getHolidaysForDate(countryCode, year, month, day) {
    if (!countryCode) return [];
    const key = `${countryCode}_${year}`;
    const list = holidaysByCountryYear[key];
    if (!list) return [];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return list.filter(h => h.date === dateStr).map(h => h.name);
}

// Global calendar: all festivals on this date across all countries (name + country code from API)
function getGlobalHolidaysForDate(year, month, day) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const result = [];
    getGlobalCountryCodes().forEach(cc => {
        const list = holidaysByCountryYear[`${cc}_${year}`];
        if (!list) return;
        list.filter(h => h.date === dateStr).forEach(h => result.push(`${h.name} (${cc})`));
    });
    return result;
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}Tab`) {
                    content.classList.add('active');
                    if (targetTab === 'map' && map) setTimeout(() => map.invalidateSize(), 100);
                    if (targetTab === 'calendar') loadHolidaysAndRenderCalendar();
                }
            });
        });
    });
}

function setupMap() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
    }).addTo(map);
    countries.forEach(country => {
        L.marker([country.lat, country.lng])
            .addTo(map)
            .bindPopup(`<b>${country.name}</b>`)
            .on('click', () => selectCountry(country));
    });
    map.on('click', (e) => {
        let nearest = null, minD = Infinity;
        countries.forEach(c => {
            const d = Math.sqrt(Math.pow(e.latlng.lat - c.lat, 2) + Math.pow(e.latlng.lng - c.lng, 2));
            if (d < minD && d < 5) { minD = d; nearest = c; }
        });
        if (nearest) selectCountry(nearest);
    });
}

function setupCountryList() {
    const listEl = document.getElementById('countryList');
    listEl.innerHTML = '';
    countries.forEach(country => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.innerHTML = `
            <span class="country-item-flag">${country.flag}</span>
            <span class="country-item-name">${country.name}</span>
            <span class="country-item-timezone">${country.timezone}</span>
        `;
        item.addEventListener('click', () => selectCountry(country));
        listEl.appendChild(item);
    });
}

function setupSearch() {
    document.getElementById('countrySearch').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.country-item').forEach(item => {
            const name = item.querySelector('.country-item-name').textContent.toLowerCase();
            const tz = item.querySelector('.country-item-timezone').textContent.toLowerCase();
            item.style.display = (name.includes(q) || tz.includes(q)) ? 'flex' : 'none';
        });
    });
}

function selectCountry(country) {
    currentCountry = country;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    document.getElementById('flagEmoji').textContent = isMobile ? country.flag : '';
    document.getElementById('countryName').textContent = country.name;
    document.getElementById('timezone').textContent = country.timezone;
    updateTime();
    updateSeason();
    saveLastCountry();
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    timeUpdateInterval = setInterval(updateTime, 1000);
    document.querySelectorAll('.country-item').forEach(item => {
        if (item.querySelector('.country-item-name').textContent === country.name) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    if (map) map.setView([country.lat, country.lng], 5);
    const calendarTab = document.getElementById('calendarTab');
    if (calendarTab && calendarTab.classList.contains('active')) {
        loadHolidaysAndRenderCalendar();
    }
    updateCalendarHint();
}

function updateTime() {
    if (!currentCountry) return;
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: currentCountry.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: currentCountry.timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('currentTime').textContent = formatter.format(now);
        document.getElementById('currentDate').textContent = dateFormatter.format(now);
    } catch (err) {
        document.getElementById('currentTime').textContent = '--:--:--';
        document.getElementById('currentDate').textContent = '--';
    }
}

function getSeason(country) {
    if (!country) return '--';
    const month = new Date().getMonth() + 1;
    const north = country.lat > 0;
    if (north) {
        if (month >= 12 || month <= 2) return 'Winter ❄️';
        if (month <= 5) return 'Spring 🌸';
        if (month <= 8) return 'Summer ☀️';
        return 'Autumn 🍂';
    } else {
        if (month >= 12 || month <= 2) return 'Summer ☀️';
        if (month <= 5) return 'Autumn 🍂';
        if (month <= 8) return 'Winter ❄️';
        return 'Spring 🌸';
    }
}

function updateSeason() {
    document.getElementById('seasonValue').textContent = currentCountry ? getSeason(currentCountry) : '--';
}

function setupCalendar() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        loadHolidaysAndRenderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        loadHolidaysAndRenderCalendar();
    });
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            calendarView = btn.getAttribute('data-view');
            loadHolidaysAndRenderCalendar();
        });
    });
    renderCalendar();
}

async function loadHolidaysAndRenderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    showCalendarLoading();
    try {
        if (calendarView === 'country') {
            // Use the same country selected for time checking
            if (currentCountry && currentCountry.countryCode) {
                await fetchHolidays(currentCountry.countryCode, year);
                if (month === 11) await fetchHolidays(currentCountry.countryCode, year + 1);
            }
        } else {
            const codes = getGlobalCountryCodes();
            await Promise.all(codes.map(cc => fetchHolidays(cc, year)));
            if (month === 11) await Promise.all(codes.map(cc => fetchHolidays(cc, year + 1)));
        }
    } finally {
        hideCalendarLoading();
    }
    renderCalendar();
}

function updateCalendarHint() {
    const hint = document.getElementById('calendarHint');
    if (!hint) return;
    if (calendarView === 'global') {
        hint.textContent = 'Public holidays from all countries (Nager.Date API)';
        return;
    }
    // Country view: use the same country as time checking
    if (currentCountry) {
        if (currentCountry.countryCode) {
            hint.textContent = 'Holidays for ' + currentCountry.name + ' (Nager.Date API)';
        } else {
            hint.textContent = 'Holiday data not available for ' + currentCountry.name + ' — try Global or another country';
        }
    } else {
        hint.textContent = 'Select a country (Map/List) or use Global to see holidays';
    }
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    const monthYearEl = document.getElementById('calendarMonthYear');
    updateCalendarHint();
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const countryCode = calendarView === 'country' && currentCountry && currentCountry.countryCode ? currentCountry.countryCode : null;
    calendarEl.innerHTML = '';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'calendar-day-header';
        h.textContent = d;
        calendarEl.appendChild(h);
    });
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendarEl.appendChild(empty);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        const date = new Date(year, month, day);
        if (date.toDateString() === today.toDateString()) cell.classList.add('today');
        const names = calendarView === 'global'
            ? getGlobalHolidaysForDate(year, month + 1, day)
            : (countryCode ? getHolidaysForDate(countryCode, year, month + 1, day) : []);
        cell.innerHTML = `<span class="day-number">${day}</span>`;
        if (names.length > 0) {
            const label = document.createElement('div');
            label.className = 'calendar-day-festivals';
            label.textContent = names.join(', ');
            cell.appendChild(label);
            cell.classList.add('has-events');
        }
        calendarEl.appendChild(cell);
    }
}

window.addEventListener('resize', () => {
    detectMobile();
    if (currentCountry) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        document.getElementById('flagEmoji').textContent = isMobile ? currentCountry.flag : '';
    }
});

document.addEventListener('DOMContentLoaded', init);
