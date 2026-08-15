import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    icon: ShoppingBag,
    title: 'Free Shipping',
    description: 'Free shipping on orders above $100',
  },
  {
    icon: DollarSign,
    title: 'Money Back Guarantee',
    description: 'Within 30 days of purchase',
  },
  {
    icon: WalletCards,
    title: 'Flexible Payment',
    description: 'Pay with credit card, PayPal or COD',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    description: 'Get support at any time',
  },
]

const IconBoxes = () => {
  return (
      <Card className='overflow-hidden border- bg-card shadow-sm'>
        <CardContent className='grid grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title}
              className={`group relative flex items-center gap-4 p-5 transition-colors hover:bg-muted/50 sm:p-6
              lg:flex-col lg:items-start lg:gap-4 ${index < features.length - 1  ? 'border-b sm:border-b-0 lg:border-r' : ''} 
              ${index === 1 ? 'sm:border-r0 lg:border-r': ''}`}>

                {/*ICON*/}
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-all
                duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground'>
                  <Icon className='h-5 w-5'
                  strokeWidth={1.8} />
                </div>

                {/*CONTENT*/}
                <div className='space-y-1.5'>
                  <h3 className='text-sm font-semibold tracking-tight text-foreground sm:text-base'>
                    {feature.title}
                  </h3>
                  <p className='max-w-xs text-xs leading-5 text-muted-foreground sm:text-sm'>
                    {feature.description}
                  </p>
                </div>

              </div>
            )
          })}
        </CardContent>
      </Card>
  );
};

export default IconBoxes;