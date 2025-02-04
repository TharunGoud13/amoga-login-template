"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { GET_CONTACTS_API } from "@/constants/envConfig";
import { countries, states } from "@/lib/country-state-data";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NewContact = ({ data, isEdit }: { data: any; isEdit: boolean }) => {
  const router = useRouter();
  const [availableStates, setAvailableStates] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    fullName: "",
    businessName: "",
    businessNumber: "",
    designation: "",
    department: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    zipcode: "",
    mapLink: "",
    password: "",
    roles: "",
    status: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  console.log("data-------", data);

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.user_name,
        businessName: data.business_name,
        businessNumber: data.business_number,
        designation: data.designation,
        department: data.department,
        email: data.user_email,
        mobile: data.user_mobile,
        address1: data.business_address_1,
        address2: data.business_address_2,
        country: data.business_country,
        state: data.business_state,
        zipcode: data.business_postcode,
        mapLink: data.geo_map_url,
        password: data.password,
        roles: data.roles,
        status: data.status,
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_name: formData.fullName,
      business_name: formData.businessName,
      business_number: formData.businessNumber,
      designation: formData.designation,
      department: formData.department,
      user_email: formData.email,
      user_mobile: formData.mobile,
      business_address_1: formData.address1,
      business_address_2: formData.address2,
      business_country: formData.country,
      business_state: formData.state,
      business_postcode: formData.zipcode,
      geo_map_url: formData.mapLink,
      password: formData.password,
      roles: formData.roles,
      status: formData.status,
    };
    const response = await fetch(
      isEdit
        ? `${GET_CONTACTS_API}?user_catalog_id=eq.${data.user_catalog_id}`
        : GET_CONTACTS_API,
      {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      setIsLoading(false);
      toast({
        description: isEdit
          ? "Contact updated successfully"
          : "Contact created successfully",
        variant: "default",
      });

      setFormData({
        firstName: "",
        lastName: "",
        fullName: "",
        businessName: "",
        businessNumber: "",
        designation: "",
        department: "",
        email: "",
        mobile: "",
        address1: "",
        address2: "",
        country: "",
        state: "",
        zipcode: "",
        mapLink: "",
        password: "",
        roles: "",
        status: "",
      });
      //   router.push("/contacts");
    } else {
      setIsLoading(false);
      toast({
        description: isEdit
          ? "Failed to updated contact"
          : "Failed to create contact",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(
        (c) => c.name === formData.country
      );
      if (selectedCountry) {
        const countryStates = states[selectedCountry.code] || [];
        setAvailableStates(countryStates);
      } else {
        setAvailableStates([]);
      }
    }
  }, [formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log({ id, value });
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    if (field === "country") {
      const selectedCountry = countries.find((c) => c.code === value);
      setFormData((prev) => ({
        ...prev,
        [field]: selectedCountry?.name || "",
        state: "", // Reset state when country changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  return (
    <div className="w-full max-w-[800px] mx-auto p-4">
      <Card className="p-4">
        <CardContent>
          <div className="flex justify-between mb-6 items-center">
            <h1 className="text-2xl font-bold">
              {isEdit ? "Edit Contact" : "Add New Contact"}
            </h1>
            <Button
              variant={"outline"}
              className="border-0"
              onClick={() => router.push("/contacts")}
            >
              Back to List
            </Button>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  placeholder="Enter First Name"
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  placeholder="Enter Last Name"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                required
                placeholder="Enter Full Name"
                onChange={handleChange}
                value={formData.fullName}
              />
            </div>
            <div>
              <Label htmlFor="businessName">Business Name</Label>

              <Input
                id="businessName"
                required
                placeholder="Enter Business Name"
                onChange={handleChange}
                value={formData.businessName}
              />
            </div>
            <div>
              <Label htmlFor="businessNumber">Business Number</Label>
              <Input
                id="businessNumber"
                required
                placeholder="Enter Business Number"
                onChange={handleChange}
                value={formData.businessNumber}
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                required
                placeholder="Enter Designation"
                onChange={handleChange}
                value={formData.designation}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                required
                placeholder="Enter Department"
                onChange={handleChange}
                value={formData.department}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                required
                id="email"
                placeholder="Enter Email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>

              <Input
                type="number"
                required
                id="mobile"
                placeholder="Enter Mobile"
                onChange={handleChange}
                value={formData.mobile}
              />
            </div>
            <div>
              <Label htmlFor="address1">Address 1</Label>
              <Input
                required
                id="address1"
                placeholder="Enter Address 1"
                onChange={handleChange}
                value={formData.address1}
              />
            </div>
            <div>
              <Label htmlFor="address2">Address 2</Label>
              <Input
                required
                id="address2"
                placeholder="Enter Address 2"
                onChange={handleChange}
                value={formData.address2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  required
                  value={
                    countries.find((c) => c.name === formData.country)?.code ||
                    ""
                  }
                  onValueChange={(value) =>
                    handleSelectChange(value, "country")
                  }
                >
                  <SelectTrigger className="w-full" id="country">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  required
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange(value, "state")}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="w-full" id="state">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                required
                id="zipcode"
                placeholder="Enter Zipcode"
                onChange={handleChange}
                value={formData.zipcode}
              />
            </div>
            <div>
              <Label htmlFor="mapLink">Map Link</Label>
              <Input
                required
                id="mapLink"
                placeholder="Enter Map Link"
                onChange={handleChange}
                value={formData.mapLink}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                required
                id="password"
                type="password"
                placeholder="Enter Password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            <div>
              <Label htmlFor="roles">Roles</Label>
              <Input
                required
                id="roles"
                placeholder="Enter Roles"
                onChange={handleChange}
                value={formData.roles}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                required
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger className="w-full" id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/contacts")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewContact;
