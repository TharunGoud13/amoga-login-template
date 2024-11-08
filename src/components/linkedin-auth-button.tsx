'use client';

import { LinkedinIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function LinkedInSignInButton() {

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        console.log("linkedin sign in not implemented yet")
      }
    >
      <LinkedinIcon className="mr-2 h-4 w-4"/>
      LinkedIn
    </Button>
  );
}