import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppSettings, type AppSettings } from "@/lib/app-settings";

const TITLE = "Settings | AI Workplace Productivity Assistant";
const DESCRIPTION =
  "Set your default email tone, response length, signature and suggested prompts for the AI workplace assistant.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update, reset } = useAppSettings();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Preferences are applied to every AI request and stored only in this browser."
      />

      <Card className="card-elevated rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-base">Your identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender name</Label>
            <Input
              id="senderName"
              placeholder="e.g. Alex Morgan"
              value={settings.senderName}
              onChange={(event) => update({ senderName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature">Email signature</Label>
            <Textarea
              id="signature"
              placeholder={"Kind regards,\nAlex Morgan\nOperations Lead"}
              className="min-h-[110px] resize-y"
              value={settings.signature}
              onChange={(event) => update({ signature: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-base">AI preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="defaultTone">Default email tone</Label>
            <Select
              value={settings.defaultTone}
              onValueChange={(value) =>
                update({ defaultTone: value as AppSettings["defaultTone"] })
              }
            >
              <SelectTrigger id="defaultTone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="responseLength">Response length</Label>
            <Select
              value={settings.responseLength}
              onValueChange={(value) =>
                update({ responseLength: value as AppSettings["responseLength"] })
              }
            >
              <SelectTrigger id="responseLength" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concise">Concise</SelectItem>
                <SelectItem value="Balanced">Balanced</SelectItem>
                <SelectItem value="Detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-secondary/40 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Suggested prompts in chat</p>
              <p className="text-xs text-muted-foreground">
                Show starter prompts on an empty conversation.
              </p>
            </div>
            <Switch
              checked={settings.showSuggestedPrompts}
              onCheckedChange={(checked) => update({ showSuggestedPrompts: checked })}
              aria-label="Toggle suggested prompts"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-base">Local data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This app has no database. Saved email drafts and these preferences live only in your
            browser and can be removed at any time.
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              reset();
              toast.success("Local drafts and preferences cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear local data
          </Button>
        </CardContent>
      </Card>

      <AiDisclaimer />
    </div>
  );
}
