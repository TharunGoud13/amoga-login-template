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

const NewContact = ({
  data,
  isEdit = false,
}: {
  data?: any;
  isEdit?: boolean;
}) => {
  const router = useRouter();
  const [availableStates, setAvailableStates] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

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
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.businessName.trim()) newErrors.businessName = "Required";
    if (!formData.businessNumber.trim()) newErrors.businessNumber = "Required";
    if (!formData.designation.trim()) newErrors.designation = "Required";
    if (!formData.department.trim()) newErrors.department = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.mobile.trim()) newErrors.mobile = "Required";
    if (!formData.address1.trim()) newErrors.address1 = "Required";
    if (!formData.address2.trim()) newErrors.address2 = "Required";
    if (!formData.country.trim()) newErrors.country = "Required";
    if (!formData.state.trim()) newErrors.state = "Required";
    if (!formData.zipcode.trim()) newErrors.zipcode = "Required";
    if (!formData.mapLink.trim()) newErrors.mapLink = "Required";
    if (!formData.password.trim()) newErrors.password = "Required";
    if (!formData.roles.trim()) newErrors.roles = "Required";
    if (!formData.status.trim()) newErrors.status = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("validate----", !validateForm());
    if (!validateForm()) return;

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

  const handleSelectChange = (value: string, field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
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
                <div className="flex justify-between">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <Input
                  id="firstName"
                  placeholder="Enter First Name"
                  onChange={handleChange}
                  value={formData.firstName}
                  className={errors.firstName ? "border-red-500" : ""}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
                <Input
                  id="lastName"
                  placeholder="Enter Last Name"
                  onChange={handleChange}
                  value={formData.lastName}
                  className={errors.lastName ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>
              <Input
                id="fullName"
                placeholder="Enter Full Name"
                onChange={handleChange}
                value={formData.fullName}
                className={errors.fullName ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="businessName">
                  Business Name <span className="text-red-500">*</span>
                </Label>
                {errors.businessName && (
                  <p className="text-red-500 text-sm">{errors.businessName}</p>
                )}
              </div>

              <Input
                id="businessName"
                placeholder="Enter Business Name"
                onChange={handleChange}
                value={formData.businessName}
                className={errors.businessName ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="businessNumber">
                  Business Number <span className="text-red-500">*</span>
                </Label>
                {errors.businessNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.businessNumber}
                  </p>
                )}
              </div>
              <Input
                id="businessNumber"
                placeholder="Enter Business Number"
                onChange={handleChange}
                value={formData.businessNumber}
                className={errors.businessNumber ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="designation">
                  Designation <span className="text-red-500">*</span>
                </Label>
                {errors.designation && (
                  <p className="text-red-500 text-sm">{errors.designation}</p>
                )}
              </div>
              <Input
                id="designation"
                placeholder="Enter Designation"
                onChange={handleChange}
                value={formData.designation}
                className={errors.designation ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department}</p>
                )}
              </div>
              <Input
                id="department"
                placeholder="Enter Department"
                onChange={handleChange}
                value={formData.department}
                className={errors.department ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <Input
                type="email"
                id="email"
                placeholder="Enter Email"
                onChange={handleChange}
                value={formData.email}
                className={errors.email ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="mobile">
                  Mobile <span className="text-red-500">*</span>
                </Label>
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>

              <Input
                type="number"
                id="mobile"
                placeholder="Enter Mobile"
                onChange={handleChange}
                value={formData.mobile}
                className={errors.mobile ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="address1">
                  Address 1 <span className="text-red-500">*</span>
                </Label>
                {errors.address1 && (
                  <p className="text-red-500 text-sm">{errors.address1}</p>
                )}
              </div>
              <Input
                id="address1"
                placeholder="Enter Address 1"
                onChange={handleChange}
                value={formData.address1}
                className={errors.address1 ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="address2">
                  Address 2 <span className="text-red-500">*</span>
                </Label>
                {errors.address2 && (
                  <p className="text-red-500 text-sm">{errors.address2}</p>
                )}
              </div>

              <Input
                id="address2"
                placeholder="Enter Address 2"
                onChange={handleChange}
                value={formData.address2}
                className={errors.address2 ? "border-red-500" : ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  {errors.country && (
                    <p className="text-red-500 text-sm">{errors.country}</p>
                  )}
                </div>
                <Select
                  value={
                    countries.find((c) => c.name === formData.country)?.code ||
                    ""
                  }
                  onValueChange={(value) =>
                    handleSelectChange(value, "country")
                  }
                >
                  <SelectTrigger
                    className={errors.country ? "border-red-500" : ""}
                    id="country"
                  >
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
                <div className="flex justify-between">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state}</p>
                  )}
                </div>

                <Select
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange(value, "state")}
                  disabled={!formData.country}
                >
                  <SelectTrigger
                    className={errors.state ? "border-red-500" : ""}
                    id="state"
                  >
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
              <div className="flex justify-between">
                <Label htmlFor="zipcode">
                  Zipcode <span className="text-red-500">*</span>
                </Label>
                {errors.zipcode && (
                  <p className="text-red-500 text-sm">{errors.zipcode}</p>
                )}
              </div>

              <Input
                id="zipcode"
                placeholder="Enter Zipcode"
                onChange={handleChange}
                value={formData.zipcode}
                className={errors.zipcode ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="mapLink">
                  Map Link <span className="text-red-500">*</span>
                </Label>
                {errors.mapLink && (
                  <p className="text-red-500 text-sm">{errors.mapLink}</p>
                )}
              </div>

              <Input
                id="mapLink"
                placeholder="Enter Map Link"
                onChange={handleChange}
                value={formData.mapLink}
                className={errors.mapLink ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                onChange={handleChange}
                value={formData.password}
                className={errors.password ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="roles">
                  Roles <span className="text-red-500">*</span>
                </Label>
                {errors.roles && (
                  <p className="text-red-500 text-sm">{errors.roles}</p>
                )}
              </div>
              <Input
                id="roles"
                placeholder="Enter Roles"
                onChange={handleChange}
                value={formData.roles}
                className={errors.roles ? "border-red-500" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
              </div>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger
                  className={errors.status ? "border-red-500" : ""}
                  id="status"
                >
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
