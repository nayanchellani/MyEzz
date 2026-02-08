

//import { motion } from "framer-motion";
//import MenuItem from "./MenuItem";

//function MenuCategory({ category, vendor, addToCart }) {
       //const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="grid grid-cols-1 md:grid-cols-2 gap-4"
//     >
//       {category.items.map((item) => (
//         <MenuItem
//           key={item.id}
//           item={item}
//           vendor={vendor}
//           addToCart={addToCart}
//         />
//       ))}
//     </motion.div>
//   );
// }

// export default MenuCategory;


import { motion } from "framer-motion";
import MenuItem from "./MenuItem";

function MenuCategory({ category, vendor, addToCart }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {category.items &&
        category.items.map((item) => (
          <MenuItem key={item.id} item={item} vendor={vendor} addToCart={addToCart} />
        ))}
    </motion.div>
  );
}

export default MenuCategory;