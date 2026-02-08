import { motion } from 'framer-motion';
import { Search, ShoppingBag, MapPin } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'Choose',
    description: 'Browse local vendors & street food',
  },
  {
    id: 2,
    icon: ShoppingBag,
    title: 'Order',
    description: 'Lightning-fast checkout',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Track & Eat',
    description: 'Live updates until it is at your door',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-white">
      {/* Soft gradient transition from above */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How It <span className="text-orange-500">Works</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto">
            From craving to delivery in 3 simple steps
          </p>
        </div>

        {/* Desktop: Horizontal Steps */}
        <div className="hidden md:flex items-start justify-center gap-8 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-center text-center flex-1 max-w-[200px] relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-100" />
              )}
              
              {/* Step number badge */}
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg z-10">
                {step.id}
              </div>
              
              {/* Icon - Orange themed */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-5 shadow-xl shadow-orange-500/30 relative z-10">
                <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-gray-800 text-lg mb-1.5">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical Stepper */}
        <div className="md:hidden flex flex-col gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 relative"
            >
              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-[72px] w-0.5 h-[calc(100%-40px)] bg-gradient-to-b from-orange-300 to-orange-100" />
              )}
              
              {/* Icon */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <step.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                {/* Step number */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {step.id}
                </div>
              </div>
              
              {/* Content */}
              <div className="pt-2">
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
