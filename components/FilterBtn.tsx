import {
    Funnel,
} from "lucide-react"

const FilterBtn = () => {
  return (
    <div>
        <button className="flex items-center rounded cursor-pointer border-2 border-primary bg-primary px-2 sm:px-3 py-1 text-sm font-medium text-white transition-colors hover:border-primary hover:bg-white hover:text-primary">
            <Funnel size={20}/>
            <span className="ml-1 text-lg font-bold sm:text-xl">Filter</span>
        </button>   
    </div>
  )
}

export default FilterBtn