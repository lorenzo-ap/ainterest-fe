import i18next from 'i18next';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import App from './App.tsx';
import en from './assets/i18n/en.json';
import ro from './assets/i18n/ro.json';
import './index.css';
import { store } from './redux';
import { Language } from './types';

i18next.init({
  lng: localStorage.getItem('lang') || Language.EN,
  resources: {
    en: { translation: en },
    ro: { translation: ro }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </StrictMode>
);
