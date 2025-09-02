import React from "react";
import { Header } from "components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { comboBoxItems, selectItems } from "~/constants";
import type { Route } from "./+types/create-trip";
import {cn, formatKey} from "~/lib/utils";

export const loader = async () => {
    const response = await fetch('https://cdn.simplelocalize.io/public/v1/countries');
    const data = await response.json();
    console.log(data);

    return data.map((country: any) => ({
        name: country.name_local,
        flagUrl: `https://flagsapi.com/${country.iso_3166_1_alpha2}/flat/24.png`,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap,
    }))
}

const CreateTrip = ({loaderData} : Route.ComponentProps) => {

    const countries = loaderData as Country[];


    const handleSubmit = async () => {
       return 
       }

       const handleChange = (key: keyof TripFormData, value: string | number ) => {
        
       }

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
        flagUrl: country.flagUrl
    }))

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

                    {/* <div>
                        <ComboBoxComponent
                        id=""
                        dataSource={},
                        ></ComboBoxComponent>
                    </div> */}
                </form>
            </section>
        </main>
    )
}

export default CreateTrip