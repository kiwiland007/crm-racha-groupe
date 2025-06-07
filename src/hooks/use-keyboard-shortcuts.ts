import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  handler: () => void;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const shortcuts: ShortcutHandler[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Retour à l\'accueil',
      handler: () => navigate('/'),
    },
    {
      key: 'c',
      ctrl: true,
      description: 'Aller aux contacts',
      handler: () => navigate('/contacts'),
    },
    {
      key: 't',
      ctrl: true,
      description: 'Aller aux tâches',
      handler: () => navigate('/tasks'),
    },
    {
      key: 'i',
      ctrl: true,
      description: 'Aller à l\'inventaire',
      handler: () => navigate('/inventory'),
    },
    {
      key: '/',
      description: 'Ouvrir la recherche',
      handler: () => {
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
      },
    },
    {
      key: 'Escape',
      description: 'Fermer les modales',
      handler: () => {
        document.querySelector<HTMLElement>('[data-modal-close]')?.click();
      },
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          !!s.ctrl === event.ctrlKey &&
          !!s.alt === event.altKey &&
          !!s.shift === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.handler();
        toast({
          title: 'Raccourci clavier',
          description: shortcut.description,
        });
      }
    },
    [shortcuts, toast]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getShortcutsHelp = () =>
    shortcuts.map((s) => {
      const keys = [];
      if (s.ctrl) keys.push('Ctrl');
      if (s.alt) keys.push('Alt');
      if (s.shift) keys.push('Shift');
      keys.push(s.key.toUpperCase());
      
      return {
        keys: keys.join('+'),
        description: s.description,
      };
    });

  return {
    shortcuts: getShortcutsHelp(),
  };
};