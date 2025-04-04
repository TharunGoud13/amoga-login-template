"use client";
import React, { FC, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSession } from "next-auth/react";

interface SaveEmailDetailsProps {
  setIsPopoverOpen: any;
  createImapDetails?: any;
  getAllImapDetails?: any;
}

const SaveEmailDetails: FC<SaveEmailDetailsProps> = ({
  setIsPopoverOpen,
  getAllImapDetails,
  createImapDetails,
}) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [tls, setTls] = useState(true);
  const { data: session } = useSession();
  const sessionDetails = session?.user;
  const createdDate = new Date().toUTCString();

  const handleSave = (e: any) => {
    e.preventDefault();
    createImapDetails({
      user,
      password,
      host,
      port,
      tls,
      sessionDetails,
      createdDate,
    });
    getAllImapDetails();
    setIsPopoverOpen(false);
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSave}>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="user">User</Label>
            <Input
              id="user"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter User"
              className="col-span-2 h-8 focus:!ring-offset-0 focus:!ring-0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="password">Password</Label>
            <Input
              required
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter Password"
              type="password"
              className="col-span-2 h-8 focus:!ring-offset-0 focus:!ring-0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="host">Host</Label>
            <Input
              required
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Host"
              className="col-span-2 h-8 focus:!ring-offset-0 focus:!ring-0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="port">Port</Label>
            <Input
              required
              type="number"
              inputMode="numeric"
              id="port"
              placeholder="993"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="col-span-2 h-8 focus:!ring-offset-0 focus:!ring-0"
            />
          </div>
          <div className="grid grid-cols-3  items-center gap-4">
            <Label htmlFor="tls">TLS</Label>
            <Select onValueChange={(value: any) => setTls(value)} required>
              <SelectTrigger className="md:w-[188px] w-[162px]">
                <SelectValue placeholder="Select TLS" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full mt-2.5">
          Save
        </Button>
      </form>
    </div>
  );
};

export default SaveEmailDetails;
