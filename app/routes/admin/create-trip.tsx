import React, { useState } from "react";
import { Header } from "components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { comboBoxItems, selectItems } from "~/constants";
import type { Route } from "./+types/create-trip";
import {cn, formatKey} from "~/lib/utils";
import { MapsComponent, LayersDirective, LayerDirective } from "@syncfusion/ej2-react-maps";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { world_map } from "~/constants/world_map";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
    const response = await fetch('https://cdn.simplelocalize.io/public/v1/countries');
    const data = await response.json();

    return data.map((country: any) => ({
        name: country.name_local || country.name,
        flagUrl: `https://flagsapi.com/${country.iso_3166_1_alpha2}/flat/24.png`,
        coordinates: country.latlng,
        value: country.iso_3166_1_alpha2,
        openStreetMap: country.maps?.openStreetMap,
    }))
}

const CreateTrip = ({loaderData} : Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const navigate  = useNavigate()
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.value || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault()
        setLoading(true);

       if(
           !formData.country ||
           !formData.travelStyle ||
           !formData.interest ||
           !formData.budget ||
           !formData.groupType
       ) {
           setError('Please provide values for all fields');
           setLoading(false)
           return;
       }

       if(formData.duration < 1 || formData.duration > 10) {
           setError('Duration must be between 1 and 10 days');
           setLoading(false)
           return;
       }
       const user = await account.get();
       if(!user.$id) {
           console.error('User not authenticated');
           setLoading(false)
           return;
       }

       try {
           const response = await fetch('/api/create-trip', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify({
                   country: formData.country,
                   numberOfDays: formData.duration,
                   travelStyle: formData.travelStyle,
                   interests: formData.interest,
                   budget: formData.budget,
                   groupType: formData.groupType,
                   userId: user.$id
               })
           })

           const result: CreateTripResponse = await response.json();

        if(result?.id) navigate(`/trips/${result.id}`)
            else console.error('Failed to generate a trip')

       } catch (e) {
           console.error('Error generating trip', e);
       } finally {
           setLoading(false)
       }
    };

        const handleChange = (key: keyof TripFormData, value: string | number)  => {
    setFormData({ ...formData, [key]: value})
    }
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }))

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]
    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title='Add new trips' description='View and generate AI travel plans'/>
            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit = {handleSubmit}>
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                        id="country"
                        dataSource={countryData}
                        fields={{text: 'text', value: 'value'}}
                        placeholder="Select a Country"
                        className="combo-box"
                        value={formData.country}
                        change={(e : {value : string | undefined}) => {
                            if(e.value) {
                                handleChange('country', e.value)
                            }
                        }}
                        itemTemplate={(item) => (
                            <div className="flex items-center gap-2">
                                <img src={item.flagUrl} alt={item.text} className="w-5 h-5 rounded" />
                                <span>{item.text}</span>
                            </div>
                        )}
                        allowFiltering
                        filtering={(e) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries.filter((country) => country.name.toLowerCase().includes(query)).map(((country) => ({
                                        text: country.name,
                                        value: country.value
                                    })))
                                )
                            }}
                        
                        ></ComboBoxComponent>
                    </div>
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input 
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="Enter a number of days (5, 12 ...)" 
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) => handleChange('duration', Number(e.target.value))}
                        />
                    </div>
                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: 'text', value: 'value'}}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if(e.value) {
                                        handleChange(key, e.value)
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) => item.toLowerCase().includes(query))
                                            .map(((item) => ({
                                                text: item,
                                                value: item,
                                            }))))}}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                shapeData={world_map}
                                dataSource={mapData}
                                shapePropertyPath='name'
                                shapeDataPath="country"
                                shapeSettings={{ colorValuePath: 'color', fill: '#e5e5e5'}}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full"/>
                {error && (
                    <div className="error">
                        <p>{error}</p>
                    </div>
                )}

                <footer className="px-6 w-full">
                    <ButtonComponent type="submit"
                    className="button-class !h-12 !w-full"
                    disabled={loading}
                    >
                        <img src={`/assets/icon/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn('size-5', {'animate-spin': loading})}/>
                        <span className="p-16-semibold text-white">
                            {loading ? 'Generating...' : 'Generate Trip'}
                        </span>
                    </ButtonComponent>
                </footer>
                </form>
            </section>
        </main>
    )
}

export default CreateTrip