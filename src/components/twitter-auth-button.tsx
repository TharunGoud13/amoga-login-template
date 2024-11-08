'use client';

import { Button } from './ui/button';
import {  TwitterIcon } from 'lucide-react';

export default function TwitterSignInButton() {

  return (
    <Button
      className="w-full col-span-2"
      variant="outline"
      type="button"
      onClick={() => console.log("Twitter")
      }
    >
      <TwitterIcon className='mr-2 h-4 w-4'/>
       Twitter
    </Button>
  );
}