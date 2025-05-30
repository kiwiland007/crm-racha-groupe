import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  FileText,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { WhatsAppIntegration } from '@/components/whatsapp/WhatsAppIntegration';

interface Contact {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: string;
  source: string;
  lastContact: string;
  assignedTo: string;
  notes: string;
}

interface ContactPanelProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: number) => void;
}

export default function ContactPanel({ contact, isOpen, onClose, onEdit, onDelete }: ContactPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>(contact?.notes ? [contact.notes] : []);

  if (!isOpen || !contact) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'client':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Client</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Prospect</Badge>;
      case 'partenaire':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Partenaire</Badge>;
      case 'fournisseur':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Fournisseur</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`;
    toast.success('Appel en cours', {
      description: `Appel vers ${contact.name}`
    });
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
    toast.success('Email ouvert', {
      description: `Email vers ${contact.name}`
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
      toast.success('Note ajoutée', {
        description: 'La note a été ajoutée avec succès'
      });
    }
  };

  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
    toast.success('Note supprimée');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{contact.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={handleEmail}
                  >
                    {contact.email}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={handleCall}
                  >
                    {contact.phone}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">{contact.company}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  {getTypeBadge(contact.type)}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Source</p>
                  <p className="text-sm text-muted-foreground">{contact.source}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Dernier contact</p>
                  <p className="text-sm text-muted-foreground">{contact.lastContact}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button size="sm" variant="outline" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <WhatsAppIntegration
              contactPhone={contact.phone}
              contactName={contact.name}
            />
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Créer devis
            </Button>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Notes</h3>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            </div>

            {/* Add new note */}
            <div className="space-y-2">
              <Textarea
                placeholder="Ajouter une note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setNewNote('')}>
                  Annuler
                </Button>
                <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Existing notes */}
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{note}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Aujourd'hui à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-red-600">Zone de danger</h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(contact.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer le contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
