// Internationalization (i18n) module
const i18n = {
    currentLanguage: 'fr', // Default language
    translations: {},
    
    // Initialize i18n system
    async init() {
        // Load saved language preference or default to French
        const savedLang = localStorage.getItem('flute-calc-language') || 'fr';
        await this.setLanguage(savedLang);
    },
    
    // Load language file
    async loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}`);
            }
            this.translations = await response.json();
            this.currentLanguage = lang;
            return true;
        } catch (error) {
            console.error('Error loading language file:', error);
            return false;
        }
    },
    
    // Set language and update UI
    async setLanguage(lang) {
        const success = await this.loadLanguage(lang);
        if (success) {
            localStorage.setItem('flute-calc-language', lang);
            this.updateUI();
            this.updateLanguageSelector();
        }
    },
    
    // Get translation for a key
    t(key, params = {}) {
        let text = this.translations[key] || key;
        
        // Replace parameters in the text
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    },
    
    // Update all UI elements with translations
    updateUI() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            // Check if element has data-i18n-attr to update an attribute instead of text
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, text);
            } else {
                element.textContent = text;
            }
        });
        
        // Update elements with data-i18n-html attribute (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });
        
        // Trigger update for dynamic content
        if (typeof onHoleNumberChange === 'function') {
            onHoleNumberChange();
        }
    },
    
    // Update language selector buttons to show active state
    updateLanguageSelector() {
        document.querySelectorAll('.language-selector button').forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
};

// Switch language function (called from HTML)
async function switchLanguage(lang) {
    await i18n.setLanguage(lang);
}
