import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { DatetimePicker } from "../ui/datetime-picker";
import { DropdownMenu } from "../ui/dropdown-menu";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LocationSelector from "../ui/location-input";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

const renderInputField = ({
    currentField,
    inputValue,
    setInputValue,
    formData,
    setFormData,
    setSelectedImage
  }: {
    currentField: any
    inputValue: string;
    setInputValue: (value: string) => void;
    formData: Record<string, any>;
    setFormData: (formData: Record<string, any>) => void;
    setSelectedImage: any
  }) => {

    console.log("current-----",currentField)
    switch (currentField.variant) {
      case "Text Area":
        return (
          <Textarea
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Text Box":
        return (
          <Input
            type="text"
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Number":
        return (
          <Input
            type="number"
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Mobile":
        return (
          <Input
            type="number"
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "OTP":
        return (
          <Input
            type="text"
            maxLength={6}
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Email":
        return (
          <Input
            type="email"
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Password":
        return (
          <Input
            type="password"
            placeholder={currentField.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#1a1d27] text-white border-gray-700 placeholder:text-gray-400"
          />
        );
      case "Date":
        return (
          <Calendar
            mode="single"
            // selected={formData[currentField.name]}
            // onSelect={(date:any) =>
            //   setFormData((prev:any) => ({ ...prev, [currentField.name]: new Date(date).toDateString() }))
            // }
            onSelect={(date:any) =>
              setInputValue(new Date(date).toDateString())
            }
            className="rounded-md border"
          />
        );
      case "Date Time":
        return (
          <DatetimePicker
            onChange={(newDate) => {
              setInputValue(newDate ? new Date(newDate).toDateString() : '');
            }}
            className="text-primary bg-secondary"
            format={[
              ["months", "days", "years"],
              ["hours", "minutes", "am/pm"],
            ]}
          />
        );
    //   case "Dropdown":
    //     return (
    //       <DropdownMenu
    //         options={currentField.options}
    //         value={formData[currentField.name]}
    //         onChange={(value: any) =>
    //           setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))
    //         }
    //         className="bg-[#1a1d27] text-white border-gray-700"
    //       />
    //     );
      case "Check Box":
        return (
          <>
          <Checkbox
            checked={formData[currentField.name]}
            // onChange={(value:any) => {
            //   setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))
            //   setInputValue(`Selected Services: ${value}`)
            // }
            
            // }
            onCheckedChange={(value:any) => {
              setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))
              setInputValue(`Selected Value: ${value}`)
            }}
            className="text-primary border border-primary"
          />
          <div className="flex flex-col">
          <span>{currentField.label}</span>
          <span className="text-sm">{currentField.description}</span>
          </div>
          </>
        );
      case "Radio Group":
        return (
          <RadioGroup defaultValue="comfortable" className="text-white bg-primary">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" className="text-primary" />
                <Label htmlFor="r1">{currentField.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">{currentField.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">{currentField.name}</Label>
              </div>
            </RadioGroup>
        );
      
      case "Slider":
        const min = currentField.min || 0;
      const max = currentField.max || 100;
      const step = currentField.step || 1;
      const defaultValue = 5;
        return (
          <Slider
          min={min}
          max={max}
          step={step}
          defaultValue={[defaultValue]}
            onValueChange={(value:any) =>
              // setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))s
              setInputValue(value[0])
            }
            className="text-white"
          />
        );
      case "Switch":
        return (
          <Switch
          checked={formData[currentField.checked]}
          onCheckedChange={(value:any) => {
            setFormData((prev: any) => ({ ...prev, [currentField.name]: value }))
            setInputValue(formData[currentField.checked])
          }
        }
            className="text-white"
          />
        );
        case "Image Upload":
          return(
            <div className="space-y-4 bg-[#1a1d27] p-4 rounded-lg">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file:any = e.target.files?.[0]
                if (file) {
                  console.log("file----",file)
                  const reader = new FileReader()
                  setInputValue(file.name)

                  reader.onloadend = () => {
                    setSelectedImage(file.name)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="bg-[#1a1d27] border-gray-700 text-white"
            />
            
          </div>

          )
          case "File Upload":
          return(
            <div className="space-y-4 bg-[#1a1d27] p-4 rounded-lg">
            <Input
              type="file"
              
              onChange={(e) => {
                const file:any = e.target.files?.[0]
                if (file) {
                  console.log("file----",file)
                  const reader = new FileReader()
                  setInputValue(file.name)

                  reader.onloadend = () => {
                    setSelectedImage(file.name)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="bg-[#1a1d27] border-gray-700 text-white"
            />
            
          </div>

          )

          case "Location Select":
      return (
        <>
          
          <LocationSelector
            onCountryChange={(country) => {
              setFormData((prev: any) => ({ ...prev, [currentField.name]: [country?.name || ""  ]}));
              setInputValue(currentField.name)
              
              
            }}
            onStateChange={(state) => {
              setFormData((prev: any) => ({ ...prev, [currentField.name]: [state?.name || ""  ]}));
              setInputValue(currentField.name)
            }}
          />
          
        </>
      );
      case "Progress":
      return (
        <div>
          <Progress value={50} onChange={(value:any) => setInputValue(value)} className="w-[60%] bg-primary" />
        </div>
      );
        
      default:
        return null;
    }
  };

  export default renderInputField