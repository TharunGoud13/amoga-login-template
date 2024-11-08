'use client';

import { Button } from './ui/button';
import { FacebookIcon } from 'lucide-react';

export default function FacebookInSignInButton() {

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        console.log("Facebook")
      }
    >
      <FacebookIcon className="mr-2 h-4 w-4"/>
      Facebook
    </Button>
  );
}