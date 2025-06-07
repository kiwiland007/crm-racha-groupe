import { useAccessibility } from "@/hooks/use-accessibility";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AccessibilitySettings() {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Paramètres d'accessibilité</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="font-medium">
            Contraste élevé
          </label>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) =>
              updateSettings({ highContrast: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="font-medium">
            Réduire les animations
          </label>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) =>
              updateSettings({ reducedMotion: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="focus-visible" className="font-medium">
            Focus visible
          </label>
          <Switch
            id="focus-visible"
            checked={settings.focusVisible}
            onCheckedChange={(checked) =>
              updateSettings({ focusVisible: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="font-size" className="font-medium">
            Taille de la police : {settings.fontSize}px
          </label>
          <Slider
            id="font-size"
            min={12}
            max={24}
            step={1}
            value={[settings.fontSize]}
            onValueChange={([value]) =>
              updateSettings({ fontSize: value })
            }
          />
        </div>

        <Button
          variant="outline"
          onClick={resetSettings}
          className="w-full mt-4"
        >
          Réinitialiser les paramètres
        </Button>
      </div>
    </Card>
  );
}