import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidEmail } from '@/lib/booking-calendar/utils/form-utils';

interface GuestsSectionProps {
  guests: string[];
  onGuestsChange: (guests: string[]) => void;
}

export const GuestsSection: React.FC<GuestsSectionProps> = ({
  guests,
  onGuestsChange,
}) => {
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestEmailError, setGuestEmailError] = useState('');

  const addGuest = () => {
    const trimmedEmail = guestEmail.trim();
    setGuestEmailError('');

    if (!trimmedEmail) {
      setGuestEmailError('Please enter an email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setGuestEmailError('Please enter a valid email address');
      return;
    }

    // Check for case-insensitive duplicates
    const isDuplicate = guests.some(
      (existingEmail) =>
        existingEmail.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (isDuplicate) {
      setGuestEmailError('This email has already been added');
      return;
    }

    onGuestsChange([...guests, trimmedEmail]);
    setGuestEmail('');
  };

  const removeGuest = (email: string) => {
    onGuestsChange(guests.filter((g) => g !== email));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-neutral-200">
          Add guests (optional)
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowGuestInput(!showGuestInput)}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add guests
        </Button>
      </div>

      {/* Existing Guests */}
      {guests.length > 0 && (
        <div className="space-y-2">
          {guests.map((email, index) => (
            <div key={index} className="border-neutral-600 bg-neutral-800">
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-neutral-300">{email}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGuest(email)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-auto p-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guest Input */}
      {showGuestInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => {
                setGuestEmail(e.target.value);
                setGuestEmailError('');
              }}
              placeholder="Guest email address"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGuest();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={addGuest}
            >
              Add
            </Button>
          </div>
          {guestEmailError && (
            <p className="text-sm text-red-400">{guestEmailError}</p>
          )}
        </div>
      )}
    </div>
  );
};