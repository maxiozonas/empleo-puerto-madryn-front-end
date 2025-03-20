import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";

export default function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button size="icon">
          <Menu className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-white rounded-lg">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <Button onClick={() => setIsMenuOpen(false)} size="icon">
            <Menu className="h-8 w-8" />
          </Button>
        </SheetHeader>
        {/* Add mobile menu items here */}
      </SheetContent>
    </Sheet>
  );
}
