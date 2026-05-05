import { cn } from "@/lib/utils";

const ProductPrice = ({value, className}: {value: number; className?: string}) => {
    
    //Garantir 2 casas decimais
    const stringValue = value.toFixed(2);

    //Obter o int/float
    const [intValue, floatValue] = stringValue.split('.')

    return ( 
        <p className={ cn('text-2xl', className) }>
            <span className="text-xs align-super">$</span>
            {intValue}
            <span className="text-xs align-super">.{floatValue}</span>
        </p>
     );
}
 
export default ProductPrice;