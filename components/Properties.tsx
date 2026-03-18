'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Loader2, MapPin, Home, Maximize, Sofa, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  images: string[];
  type: string;
  category: string;
  forType: string;
  area: string;
  furnishing: string;
  config: string;
  floor: string;
  description: string;
}

const ALL_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Furnished 2 BHK Apartment',
    location: 'A-1/105 Saket, Delhi',
    price: '₹30,000/mo',
    images: [
      '/properties/14rk7GxNU6sNlhmWR6kPWL64cIoZIfye4.jpg',
      '/properties/1LdlgiwlZRgpP6Lg377HK01z-aw3EoEQX.jpg',
      '/properties/1GG0Ewh3wyFFkOwWACUAO5jHkbobt_KrR.jpg',
      '/properties/1BIbGaHHazS-eVXhW51bEo72Mjy9sTlQG.jpg',
      '/properties/1hghcZ-YSt2FMgLJu8UqZUmaYOtl_iCDz.jpg',
      '/properties/1dcr_cvz2C94kPofmo8E6WlssZPPY6R1m.jpg',
      '/properties/1nRaTjV2IoeQcz0_NkN-VEh0Uf9cPOKUb.jpg',
      '/properties/119s5KWb72RuNWmjqlqaJLiMnSb4NXRnz.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '300 Sq Yd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '3rd Floor',
    description: 'Great property only for girls',
  },
  {
    id: 2,
    title: 'Furnished 2 BHK Apartment',
    location: '137 Sector 28, Gurgaon',
    price: '₹45,000/mo',
    images: [
      '/properties/1s03f6HlTUaYIgnwiWDnRr6wyPJIcAhV4.jpg',
      '/properties/1gZuY1NniDuK6hLPTzJt91w_gg4TV0B4i.jpg',
      '/properties/1t5k8uL3dOk6kbS-LbivJDHn_odH7omKz.jpg',
      '/properties/1Qprq7yYDdhZeA8MXxI4nAyxP6t19Ek2a.jpg',
      '/properties/1UVDYjm4rgiggz85M6hrckBaTorbjXqMn.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Sq Yd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '3rd Floor',
    description: 'Furnished 2 BHK',
  },
  {
    id: 3,
    title: 'Fully Furnished 2 BHK',
    location: 'F-120 Sector 41, Noida',
    price: '₹25,000/mo',
    images: [
      '/properties/15wArAm14OOsSqYYF0gFhxWjSU-CJFZ5R.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '250 Sq Yd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '3rd Floor',
    description: 'Fully Furnished',
  },
  {
    id: 4,
    title: 'Furnished 1RK / 1BHK',
    location: 'Sec-39, Gurgaon',
    price: '₹25,000/mo',
    images: [
      '/properties/1CrvFSRmzCfmp-Oatz_2szt2AMtGEgU3Q.jpg',
      '/properties/1wrosUbmVRKxHH8cbB3rePaI1wXEYF33n.jpg',
      '/properties/12wkHZXSmN9oQ-1lrdQJBpJO8G-xi4kRY.jpg',
      '/properties/1uXX1feE6mTYL6rl_rOHvEBo22wMOVNcD.jpg',
      '/properties/189mHlx-NnIkXDOi2AHfpFm-G1QxBOVTH.jpg',
      '/properties/1rNrhRomyN7eLKqFGX6xkGZ4LJ92uI807.jpg',
      '/properties/1oNhH7ENeX0VEggO9vvKBLX0bIsrcIBU4.jpg',
      '/properties/1sQqe4XTuEXFRkmxtkiCqjpWJrzq9MCoj.jpg',
      '/properties/1RofSAIYgps8QAlzIw6Kjpmnvtg_5ChZk.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '',
    furnishing: 'Furnished',
    config: '1RK / 1BHK',
    floor: '',
    description: 'Fully Furnished',
  },
  {
    id: 5,
    title: 'Semi-Furnished 3 BHK',
    location: 'CP 803 Ashadeep, Chanakya Puri',
    price: '₹2,50,000/mo',
    images: [
      '/properties/1pdL1SCQTLuKRctLMf1yKtEnP2E_mtnhd.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '3000 Sqft',
    furnishing: 'Semi-Furnished',
    config: '3 BHK',
    floor: '8th Floor',
    description: 'Study, U/R',
  },
  {
    id: 6,
    title: 'Corner Plot – Foreigners/Embassy',
    location: 'A 101, Defence Colony, South Delhi',
    price: '₹1,50,000/mo',
    images: [
      '/properties/1-QOVou0HSEprVAamQG0dkOfETgKKc2TX.jpg',
      '/properties/1SYCDeGK_JGHSjyLf2K_7N-YdLQmOKf4K.jpg',
      '/properties/1G-62qVP5HRvIpwsGByUcMEOCbzIfJQE2.jpg',
      '/properties/181EnjK2-Td714ruwmismEWwgbQgx6Eba.jpg',
      '/properties/1wFcLr-c_kjqbvNQ-BurSCs6bum3_wNfr.jpg',
      '/properties/1THHUQN2KzlEc9IMBoUVanufa8FbBpihx.jpg',
      '/properties/1elMavxqwLlwf2lZDb4JpMSD77tt4nvS9.jpg',
      '/properties/1YIfh386YjsJFomep6A6PSJ3dG_SHm-jk.jpg',
      '/properties/1vfyVkvCoHh6gxrIPeoMVaffZNslGwf6l.jpg',
      '/properties/1rjSg63C3m71k8dyA7z1Eh5nsOzVHHhmt.jpg',
    ],
    type: 'Plot',
    category: 'Residential',
    forType: 'Rent',
    area: '300 Sqyd',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: 'Ground',
    description: 'Corner plot only for Foreigners/Embassy/Experts',
  },
  {
    id: 7,
    title: 'Builder Floor with Lift',
    location: 'E-321, Greater Kailash-2, Delhi',
    price: '₹1,60,000/mo',
    images: [
      '/properties/1vVdcF-NcPAcvHOODgUgkGTE08g9MhvHZ.jpg',
      '/properties/1dsUMeCcY_RZaBPVSz12TdcMdQFE4f09Z.jpg',
      '/properties/1RxbghMTBqppDzIECD6rU-X5SfMLxzfKR.jpg',
      '/properties/1-FB_0UcLfzMoSItFhuDsCLouFvs4ucYR.jpg',
      '/properties/1Y9tsdK0fG9ynYp4gTjAO05vt7hiRFgIb.jpg',
      '/properties/1dzKDSba-r8so8DLZ3-mqrbGdGAtWWilI.jpg',
      '/properties/1lMuljDdyQGzvU9oAxzSaCpgClIMdFBOH.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '250 Sqyd',
    furnishing: 'Semi-Furnished',
    config: '3 BHK',
    floor: '1st Floor',
    description: 'Lift, Stilt, Guard (Foreigners)',
  },
  {
    id: 8,
    title: 'Park Facing 3 BHK Apartment',
    location: 'M-54 Greater Kailash-2, Delhi',
    price: '₹1,30,000/mo',
    images: [
      '/properties/1CrvFSRmzCfmp-Oatz_2szt2AMtGEgU3Q.jpg',
      '/properties/1wrosUbmVRKxHH8cbB3rePaI1wXEYF33n.jpg',
      '/properties/12wkHZXSmN9oQ-1lrdQJBpJO8G-xi4kRY.jpg',
      '/properties/189mHlx-NnIkXDOi2AHfpFm-G1QxBOVTH.jpg',
      '/properties/1rNrhRomyN7eLKqFGX6xkGZ4LJ92uI807.jpg',
      '/properties/1oNhH7ENeX0VEggO9vvKBLX0bIsrcIBU4.jpg',
      '/properties/1sQqe4XTuEXFRkmxtkiCqjpWJrzq9MCoj.jpg',
      '/properties/1RofSAIYgps8QAlzIw6Kjpmnvtg_5ChZk.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '250 Sqyd',
    furnishing: 'Semi-Furnished',
    config: '3 BHK',
    floor: '2nd Floor',
    description: 'Lift, Park facing',
  },
  {
    id: 9,
    title: 'Furnished Builder Floor – Foreigners',
    location: 'S-432 Greater Kailash-2, Delhi',
    price: '₹1,35,000/mo',
    images: [
      '/properties/1mhDX28nKtCeeldVC7kHqYKXmp_xXVPWQ.jpg',
      '/properties/1CjTB9NKvrULpbS-UcFfcpwpxNwwC818Q.jpg',
      '/properties/1gq013uYhefnkCVjywlHEqJhzQiAkzvlr.jpg',
      '/properties/1dH1-NY9JuEWA5uoQWx9xF1ftH1AcyL3O.jpg',
      '/properties/1jDgt63znOQYrocAGJyzczORIYnrUAP3x.jpg',
      '/properties/1eaaMTIrKQLUMWD-j3iHuWnbFSJiWCl4C.jpg',
      '/properties/1m2ctqpc6Gg_UGJm1G3hLZOCzIRR7rhwS.jpg',
      '/properties/1uPr5jO85yA2E08HaBphgdlIIl32aRshQ.jpg',
      '/properties/1T2v14JWaZpnjvwL4OX26VrpbcWkPV8iI.jpg',
      '/properties/1rlK2TDgilPPVwcVNL9QiejlbPmwGZ47H.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '250 Sqyd',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: '3rd Floor',
    description: 'Car parking (Foreigners)',
  },
  {
    id: 10,
    title: 'Premium 3 BHK – Anand Niketan',
    location: 'C-142 Anand Niketan, Delhi',
    price: '₹3,50,000/mo',
    images: [
      '/properties/1h273IpjkDC5fFp-YYSXad9-CVoXLQoY8.jpg',
      '/properties/1nCqyl6m8v2yJDO3nYFYL-BMk8kBvEN1K.jpg',
      '/properties/1UExomEq5xcuGgxNkxopoLH1__lWjvgZU.jpg',
      '/properties/1VsNJ-ITYRJVmNdtfBE9TNSuKb7L_wc_1.jpg',
      '/properties/1_V6JY-qfpReZ00XSb1bJljviX7mig6By.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '2400 Sqft / 325 Sqyd',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: '2nd Floor',
    description: 'Stilt, Lift, 2 Parking, Servant Quarter',
  },
  {
    id: 11,
    title: 'Park Facing Studio',
    location: '686, Sector 40, Gurgaon',
    price: '₹17,000/mo',
    images: [
      '/properties/1BUBnKumt-RfRY2Kkqp_jyuHE9h9ug_iG.jpg',
    ],
    type: 'Studio',
    category: 'Residential',
    forType: 'Rent',
    area: '100 Sqyd',
    furnishing: 'Furnished',
    config: '1 RK',
    floor: '1st Floor',
    description: 'Park facing balcony, 1 min walking distance from market',
  },
  {
    id: 12,
    title: 'Private House 2 BHK',
    location: 'Sector 40, Huda Market, Gurgaon',
    price: '₹27,000/mo',
    images: [
      '/properties/1A92R1iMuTIeF4u4GLsnJRd9ujJarrSLy.jpg',
      '/properties/1m46YtqptdjcspqZvUmRJFGLbFsPNSx0c.jpg',
      '/properties/1zEm9IIxvrYnD0cO3VJ6VtrK1fXXPtRKp.jpg',
      '/properties/1y4Myp4akCoN6RxbYYMD7z3RFcwXCJNUO.jpg',
      '/properties/1XzIdQVskGp80tJcLh-PF5oF4fSMh8Mek.jpg',
      '/properties/1kFKho-22BNLnKpUYGHxXsp7QSQ9R1hiv.jpg',
      '/properties/1x2pEdakYdNF7jG9QC9PCZmau5ML85ZqG.jpg',
      '/properties/1FbXtZ-TNwI6qjz4-XVrW5XRjCDOJNkhZ.jpg',
      '/properties/1U0t1hP_XLMk7VLThZ5kGyNQEfj3_wgu8.jpg',
      '/properties/1wwrJOMX-gk_1vNl6XV8EwJtar-juJOVU.jpg',
    ],
    type: 'Private House',
    category: 'Residential',
    forType: 'Rent',
    area: '100 Sqyd',
    furnishing: 'Semi-Furnished',
    config: '2 BHK',
    floor: '2nd Floor',
    description: '1 wash room, store, back side balcony',
  },
  {
    id: 13,
    title: 'Semi-Furnished 2 BHK Plot',
    location: 'Sector 40, Huda Market, Gurgaon',
    price: '₹27,000/mo',
    images: [
      '/properties/1dP3jW8YMFO6wi6MKzZN6mx8QSprVOqTW.jpg',
      '/properties/1DpZxaH1P0yBybGc5iBeCHx4shYxBisX_.jpg',
      '/properties/1-J5ToOMfT2OVKtfcCE4CFqu4pgB4SZFr.jpg',
      '/properties/1il8-wYG3yfrlOp0HF6lNJ9g2syuiN1cf.jpg',
      '/properties/1L10Qk2mEElrOUSDpwrKPLAQC1uBvyreE.jpg',
      '/properties/1vYdETDALKBtCF3BJU4OiGLwINxOUt45s.jpg',
      '/properties/1iQJDIvwO3GCH79nCtnJIAru0DY9Pz7qJ.jpg',
      '/properties/1g1BdP4_EaPG3Sm24c7P2JsZccRMMRUVK.jpg',
      '/properties/13QE8uENkF8d48pPxj5_f3DaaLwGnLNPi.jpg',
      '/properties/1D9Jx9GYdTup56i0ucW3IL21mXteLMJcn.jpg',
    ],
    type: 'Plot',
    category: 'Residential',
    forType: 'Rent',
    area: '100 Sqyd',
    furnishing: 'Semi-Furnished',
    config: '2 BHK',
    floor: '2nd Floor',
    description: '1 wash room, 1 store, Full balcony Backside',
  },
  {
    id: 14,
    title: 'Commercial Office – MGF Megacity',
    location: 'MG Road, MGF Megacity, Gurgaon',
    price: '₹3.1 Cr',
    images: [
      '/properties/1qitERRDeVif-dkV116lP2Er_jn9sb3pZ.jpg',
      '/properties/1N5YK6RY5OvNTQUjZzatdHj7S9WaUXXcc.jpg',
      '/properties/1uwsk-NsXhG6WpqeDw0erT_MpPS8O7yva.jpg',
      '/properties/1BXgMQOBlSKVrggM9fTHYZ02XMSonig9W.jpg',
      '/properties/1i759uDIx20fyvTGCPOme7GFe7bc44tpF.jpg',
      '/properties/1RRkH_t0AO1REgWsRJR-lmgDAkyZGKuPy.jpg',
      '/properties/18pvA3Blppi2ieQYe067-0_EJWq_3U2xX.jpg',
      '/properties/1YcJMBfimhnY_ZJmDfb5eOYSDJDd17AzL.jpg',
      '/properties/1QaioPHqHkab2gFJ-pU-dF4ctgahE87TB.jpg',
      '/properties/16CiyAlIS2DLWDb9TUE_TeTI9of9f9Ps3.jpg',
    ],
    type: 'Office Space',
    category: 'Commercial',
    forType: 'Sale',
    area: '1446 Sqft',
    furnishing: 'Furnished',
    config: 'Office',
    floor: '1st Floor',
    description: 'MGF Megacity',
  },
  {
    id: 15,
    title: 'Commercial Basement – DLF 2',
    location: 'M-10/7, DLF-2, Gurgaon',
    price: '₹1.35 Cr',
    images: [
      '/properties/1813afH5BpCjdsnym4gpotZWhq6Sg7DOf.jpg',
      '/properties/1xQx7AO9KtvN5F6b2TIYUMwcRjsUHXoqc.jpg',
      '/properties/1fOA5r5SkfPvdZxgVoH9GPX9hKg1_tYcG.jpg',
      '/properties/1yePNzjO24jjoExrmOF0pvCXPV5Zf5X_I.jpg',
      '/properties/1TcK4HUPZWgRUIgbVHGvM_DjBk9Kmbygy.jpg',
      '/properties/1T-8HyKRdUXSOcJfnmzb5nJnW8OSgFyOm.jpg',
      '/properties/1vbpTgvXfxP59uGkyUVZEoaUkkgS_cjvb.jpg',
      '/properties/1y0YvBwAn5X-uXzpSZXrhQyhT6FKTvenq.jpg',
      '/properties/1BLWCxk5zurKekuLqKVNQFOiyR50SN04Y.jpg',
      '/properties/1ECUY93IrOFHpWUwYQzn-5spNpwFOrWEQ.jpg',
    ],
    type: 'Basement',
    category: 'Commercial',
    forType: 'Sale',
    area: '215 Sqyd',
    furnishing: 'Semi-Furnished',
    config: 'Commercial',
    floor: 'Basement',
    description: 'Stilt, Lift, Pantry and Powder Room',
  },
  {
    id: 16,
    title: 'Room for Vegetarian',
    location: '178 Sector 15/1, Gurgaon',
    price: '₹28,000/mo',
    images: [
      '/properties/19JJ1vYACxq6K0HxFxSewAeg1euTUXYt9.jpg',
    ],
    type: 'Room',
    category: 'Residential',
    forType: 'Rent',
    area: '263 Sqyd',
    furnishing: 'Semi-Furnished',
    config: '2 BHK',
    floor: '2nd Floor',
    description: 'Room only for vegetarian',
  },
  {
    id: 17,
    title: 'Studio – Girls Only',
    location: 'A-1/105 Saket, Delhi',
    price: '₹30,000/mo',
    images: [
      '/properties/1Y_O0UIfI5rRUTVkLViu10AwvHSmpL_0b.jpg',
      '/properties/1i060vFDll0A5sMJlUIoNoIxrhqCxrXNA.jpg',
      '/properties/1tva-f4ay-2uN-N4oohgiCyHFAYMgdgH_.jpg',
      '/properties/1RpKaHmmq_vWacOnNmgdzMcIlhhHlAUGf.jpg',
      '/properties/1rVZM5g0VF-hpbOIgztDPV5xWM2D0f_LI.jpg',
      '/properties/13f6ZNI2aMtjAbCIFAdYdiZrVzVWUeXf3.jpg',
      '/properties/1_4pU1M0QKqRnPY38_AjP02Y2HKOCOR9w.jpg',
      '/properties/1gA9AnLvWtr8Z3c4hhZ6wlprBXtAJ5sh8.jpg',
      '/properties/1zl0OHVVPI6OzwvOxTEX-Sue1uWC0icY4.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '300 Sq Yd',
    furnishing: 'Furnished',
    config: '1 RK',
    floor: '3rd Floor',
    description: 'Studio Only For Girls',
  },
  {
    id: 18,
    title: 'Furnished Studio – Safdarjung',
    location: 'A-1/79 Safdarjung Enclave',
    price: '₹30,000/mo',
    images: [
      '/properties/1wUzStZ50F9rGA86rQJRhAfXfc6y-SzEL.jpg',
      '/properties/14M7GOTjGVgc1Yqeyoa2SU9acy675L_UQ.jpg',
      '/properties/1qN0JXFRec5po-Z0M3eG1-Gz_0u8DlYK8.jpg',
      '/properties/1lFxbSUplEzstGu6bz3x7buk6d-6PcAE0.jpg',
      '/properties/1b0tAj2XYp-jZB-h8xjZdWGNb5lr-MQno.jpg',
      '/properties/1WHUrjkvUPd2Q5AM11pEhdi7PUpag9qiI.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '250 Sq Yd',
    furnishing: 'Furnished',
    config: '1 RK',
    floor: '1st Floor',
    description: 'Studio + Water Charge 800/Month',
  },
  {
    id: 19,
    title: 'Furnished 2 Room Set',
    location: 'A-63 Sector 15, Noida',
    price: '₹22,000/mo',
    images: [
      '/properties/1GWhmNKy-9IYKOQDSDRFkkip_ud4HUkbM.jpg',
    ],
    type: 'Room',
    category: 'Residential',
    forType: 'Rent',
    area: '112 Sqm',
    furnishing: 'Furnished',
    config: '2 Room',
    floor: '2nd Floor',
    description: '3 beds, 1 washroom, 1 kitchen',
  },
  {
    id: 20,
    title: 'Basement 1 Room Set',
    location: 'C-219 Lajpat Nagar-1, Delhi',
    price: '₹35,000/mo',
    images: [
      '/properties/1PTS0E1HjF1PYDBOPqj7wOHw5BBtp44sO.jpg',
      '/properties/1yptXHUa2CkyA__qm2MH5nMqVdDX20lZa.jpg',
      '/properties/1CDwHLy3zGyLYlr1nK7YZhH5jr4Sb25vZ.jpg',
      '/properties/1-WSyOV-grHrFRa02DJaopAU7PnUcSpri.jpg',
      '/properties/1FPkJvdpF6Z2NbfB59ZK59I1ZQStyZAhL.jpg',
      '/properties/14mvgwq-w-Y9Y1md8UPkmu1jEZvdiZZl2.jpg',
    ],
    type: 'Basement',
    category: 'Residential',
    forType: 'Rent',
    area: '900 Sqft',
    furnishing: 'Semi-Furnished',
    config: '1 RK',
    floor: 'UG',
    description: 'Basement of 1 Room set',
  },
  {
    id: 21,
    title: 'Furnished 2 BHK with Store',
    location: '1262 Sector-57, Gurgaon',
    price: '₹44,000/mo',
    images: [
      '/properties/1l-8C7L5CkNX3OreMJlT-ikYCVH7NBhXd.jpg',
      '/properties/1iHs60IrO6WJUcxhIV_UskHh-f_ODg5_Z.jpg',
      '/properties/1XlBcJao1tXLBlT7Og-ArXQV9NMVYtEHk.jpg',
      '/properties/12HNJRwPPB0v6oeUldojzJh45jPDyt6TB.jpg',
      '/properties/1DddRFChq5eukNlSwFhYqXLcR9K6ekLPi.jpg',
      '/properties/1JD-q8cshJBdF-J9SQXr7uwIXiUIONFsM.jpg',
      '/properties/1wIByEAr7tSeP6cLLPuyn6OKGTawvNHtL.jpg',
      '/properties/1F7W-C-CWmg0knMiNOsKHU-kE-TX_ktE-.jpg',
      '/properties/1IkGvBaY2cSztaKezTAaKlkgX4i3J6N_a.jpg',
      '/properties/1bbguWPLgHE8SBm0fVId_IoCWM30wtAMQ.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '163 Sqyd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '2nd Floor',
    description: 'With Store',
  },
  {
    id: 22,
    title: 'Furnished 2 Room Set',
    location: 'Sec 43, Gurgaon',
    price: '₹40,000/mo',
    images: [
      '/properties/1FJKGAX0AyoBNxBO-CiwkVaQK8XQso_Hd.jpg',
    ],
    type: 'Plot',
    category: 'Residential',
    forType: 'Rent',
    area: '100 Sqyd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '1st Floor',
    description: '2 room set',
  },
  {
    id: 23,
    title: 'Renovated 3 BHK Apartment',
    location: 'Sector 56, Gurgaon',
    price: '₹60,000/mo',
    images: [
      '/properties/18WUC_9PIpzLs8AgJaeK7k0noiI-2kTio.jpg',
      '/properties/1LTavmdn9RTBweTOJgHmiaLCJqHUEYIuH.jpg',
      '/properties/1-SYfegqEbCTa5lHF4NnD5sDHBj04i8Ml.jpg',
      '/properties/134Th34sGBTfiPcmJRCgL5a6DtaC4__PE.jpg',
      '/properties/1lwbCPQ7tdpmzJQkatOw3wpohQvMJFV_G.jpg',
      '/properties/1KTboDEAosyceESNeGvjCUIBLsS25MpXk.jpg',
      '/properties/19dhL-0qhdDYRI2vcS8SlUvIXPQFwCC23.jpg',
      '/properties/10_MT0ywcI0lhw9xcKgIjCWxMHR0ddtpV.jpg',
      '/properties/14eqzPS4fwYnE0lIsgTzzLCYhTHWw17H9.jpg',
      '/properties/1nL5RAe1HeCzkWrOAUHMCLBxyMhYjACSL.jpg',
    ],
    type: 'Apartment',
    category: 'Residential',
    forType: 'Rent',
    area: '1500 Sqft',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: '1st Floor',
    description: 'Renovated',
  },
  {
    id: 24,
    title: 'Furnished 3 BHK Builder Floor',
    location: 'A-264, Sector 46, Noida',
    price: '₹60,000/mo',
    images: [],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Sq Mtr',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: '3 Floors',
    description: 'Furnished 3 BHK Builder Floor',
  },
  {
    id: 25,
    title: 'Top Floor 3 BHK Builder Floor',
    location: 'A-156 Sector-46, Noida',
    price: '₹37,000/mo',
    images: [
      '/properties/1-aey2oO0FoF9MJUOISCEhZ0EClzPnSiw.jpg',
      '/properties/19GfBQPBduMxN9lMdx8rxCiSj5fTRkgNq.jpg',
      '/properties/1G74ZV2IGAf3WfqtgbGKY4zrZrVdBwXtB.jpg',
      '/properties/1AdnjNKTu0B2vX4q10Sb15W00BhlCA5KI.jpg',
      '/properties/1C_9aE4XAfJ858K_El2SZZLkd55o9tZqS.jpg',
      '/properties/1h5fjyC1ePMLUblnv8AomlVJNfWYcsnQw.jpg',
      '/properties/1o2xb8BhFMbqaT1xI1LEL6JzEd-R6fg6Y.jpg',
      '/properties/1eeXEIgB3zKuJWda2JoqHd7tfhqt9s3FT.jpg',
      '/properties/1Cdn1tryva4eNmfZ2RXktHkuKBp8EdMB8.jpg',
      '/properties/1hOZM8mP37LbD02QBL663yLpb6vSNLP4Z.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Yd',
    furnishing: 'Furnished',
    config: '3 BHK',
    floor: '3rd (Top)',
    description: 'Top floor',
  },
  {
    id: 26,
    title: 'Full Furnished 1 BHK',
    location: 'H-33/47 DLF-1, Gurgaon',
    price: '₹30,000/mo',
    images: [
      '/properties/1dukNupSNDwrrokQbjsen5hcqYPvErlZf.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Yd',
    furnishing: 'Furnished',
    config: '1 BHK',
    floor: '1st Floor',
    description: '1 BHK full furnished',
  },
  {
    id: 27,
    title: 'Full Furnished 1 RK',
    location: 'H-33/47 DLF-1, Gurgaon',
    price: '₹25,000/mo',
    images: [
      '/properties/1zwAaxpAw5xqX63Kdg7jnI2OuzM64FrWt.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Yd',
    furnishing: 'Furnished',
    config: '1 RK',
    floor: '2nd Floor',
    description: '1 RK Full Furnished',
  },
  {
    id: 28,
    title: 'Gated Society 2 BHK – Vipul World',
    location: 'D-8B Vipul World, Sec-48, Gurgaon',
    price: '₹38,000/mo',
    images: [
      '/properties/1BIYQDMiGjGZ5KY__KdWtUkKgxGeyqwfe.jpg',
      '/properties/1VP_kuTdxRmoUcOrjAd_7_IUeJ461nDHR.jpg',
      '/properties/1dAKIuFuoOXZWC0ip0M3iKzexpzzrA85Z.jpg',
      '/properties/1mvuS7I__hvIhiMgWgGLkjOJ6aX2aSJpc.jpg',
      '/properties/1wDqv7RnRqg66NQuuLTqX0ovUM6TLzaLR.jpg',
      '/properties/1d0a-2zzhg207nYN5poriKeG_h__2tATh.jpg',
      '/properties/1l3RFlx3Ai7aV_YM8eEYr5p4b-IEVVlhF.jpg',
      '/properties/1voou6UCiGfyyhZ4R5po3qcjSMVgnf7pC.jpg',
      '/properties/1et4XhKiwgs8WF4ZNQ62xxNKWGggOgHBp.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '160 Yd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '2nd Floor',
    description: 'Gated society, 24×7 guard, lift & stilt parking, AC, modular kitchen, LED TV',
  },
  {
    id: 29,
    title: 'Full Furnished 1 BHK – Sec 48',
    location: 'D-8B Sec-48, Vipul World, Gurgaon',
    price: '₹27,000/mo',
    images: [
      '/properties/1NqnkZgma3DWjNRvj0Kcm_7anh-etCHPT.jpg',
      '/properties/1SmgvDWJiLEmiyOKOKD0RuT0l4gD4ctyQ.jpg',
      '/properties/1C8eEqFPTRbpe-u7nnmrKRwKH6dsINPeb.jpg',
      '/properties/1O2gj7Vpf2OXkFVMJcyT0aoAXFJZfh0RS.jpg',
      '/properties/1119yMcWA7PjKEAa_3Hhnh55qYuIo0ZoC.jpg',
      '/properties/1J_7mPPprUEsCXRsCMb88d5wirvIsmwqK.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '160 Yd',
    furnishing: 'Furnished',
    config: '1 BHK',
    floor: '2nd Floor',
    description: 'Full furnished',
  },
  {
    id: 30,
    title: 'Furnished 2 BHK Builder Floor',
    location: '137 Sector-28, Gurgaon',
    price: '₹45,000/mo',
    images: [
      '/properties/1s2H2ZsqHgbJK0Wh0hij29QIp7ryI1HpL.jpg',
      '/properties/1GVvyxEGxrVrhx0a00Bi_dJJP3Hq4FHId.jpg',
      '/properties/13cocJKE7jEtThwG20rcyLPi-1RMDBlb2.jpg',
      '/properties/1RgfWxrEdVLIoS_hDV7wmuKUe1pkpTguo.jpg',
      '/properties/1ZXTPEOBzMlQtP_-KFHR8rxWfZgIe567w.jpg',
      '/properties/1979ahuYwg7KSGf7iP-wcQE_9HIoTZbAw.jpg',
    ],
    type: 'Builder Floor',
    category: 'Residential',
    forType: 'Rent',
    area: '200 Yd',
    furnishing: 'Furnished',
    config: '2 BHK',
    floor: '3rd Floor',
    description: '2 bedroom furnished',
  },
];

const ITEMS_PER_PAGE = 8;

export default function Properties() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProperty) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProperty]);

  const nextImage = useCallback(() => {
    if (!selectedProperty) return;
    setCurrentImageIndex(prev => 
      prev === selectedProperty.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedProperty]);

  const prevImage = useCallback(() => {
    if (!selectedProperty) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedProperty.images.length - 1 : prev - 1
    );
  }, [selectedProperty]);

  const filteredProperties = filter === 'All'
    ? ALL_PROPERTIES
    : ALL_PROPERTIES.filter(p => p.forType === filter || p.category === filter);

  const displayProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    setIsLoading(false);
  }, [isLoading, hasMore]);

  const { ref } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMore();
      }
    },
  });

  const filters = ['All', 'Rent', 'Sale', 'Residential', 'Commercial'];

  return (
    <section id="properties" className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em] mb-4 block">Our Properties</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Exclusive Property <br />
              <span className="italic">Listings</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-white/30 text-[10px] uppercase tracking-widest hidden md:block">
              Showing {displayProperties.length} of {filteredProperties.length} listings
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setVisibleCount(ITEMS_PER_PAGE); }}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold border transition-all duration-300 ${
                filter === f
                  ? 'bg-[#C5A059] border-[#C5A059] text-black'
                  : 'border-white/10 text-white/50 hover:border-[#C5A059]/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {displayProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
              >
                <div 
                  className="relative aspect-[3/4] overflow-hidden mb-5 border border-white/5 group-hover:border-[#C5A059]/30 transition-colors duration-500"
                  onClick={() => {
                    setSelectedProperty(property);
                    setCurrentImageIndex(0);
                  }}
                >
                  {/* Image Counter Badge for Multi-Image Properties */}
                  {property.images.length > 1 && (
                    <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-white/90 uppercase tracking-[0.1em] pointer-events-none font-medium">
                      {property.images.length} Photos
                    </div>
                  )}

                  {property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                      <div className="text-center text-white/30">
                        <Maximize size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs uppercase tracking-widest">No Image Available</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-[#C5A059]/10 transition-colors duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-[#C5A059] text-black text-[9px] uppercase tracking-wider font-bold">
                      {property.forType}
                    </span>
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[9px] uppercase tracking-wider font-medium border border-white/10">
                      {property.type}
                    </span>
                  </div>

                  {/* Hover Details Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <div className="space-y-2 mb-4">
                      {property.area && (
                        <div className="flex items-center gap-2 text-white/80 text-[10px]">
                          <Maximize size={12} className="text-[#C5A059]" />
                          <span>{property.area}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-white/80 text-[10px]">
                        <Sofa size={12} className="text-[#C5A059]" />
                        <span>{property.furnishing}</span>
                      </div>
                      {property.floor && (
                        <div className="flex items-center gap-2 text-white/80 text-[10px]">
                          <Home size={12} className="text-[#C5A059]" />
                          <span>{property.floor}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        setSelectedProperty(property);
                        setCurrentImageIndex(0);
                      }}
                      className="w-full py-3.5 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-white transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-serif leading-snug group-hover:text-[#C5A059] transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[#C5A059] text-base font-bold tracking-tight bg-[#C5A059]/10 px-3 py-1 border border-[#C5A059]/30 font-serif whitespace-nowrap shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                        {property.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-white/30 shrink-0" />
                    <p className="text-white/40 text-[10px] uppercase tracking-widest truncate">{property.location}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[9px] uppercase tracking-wider">
                      {property.config}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[9px] uppercase tracking-wider">
                      {property.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading Indicator / Trigger */}
        <div ref={ref} className="mt-20 flex flex-col items-center justify-center gap-4">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="animate-spin text-[#C5A059]" size={32} />
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Loading more properties...</p>
            </motion.div>
          )}
          {!hasMore && filteredProperties.length > 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 pt-8 w-full text-center">
              You have viewed all {filteredProperties.length} properties
            </p>
          )}
          {filteredProperties.length === 0 && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 pt-8 w-full text-center">
              No properties found for this filter
            </p>
          )}
        </div>
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-10 py-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-[#0F0F0F] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#C5A059] hover:text-black transition-all duration-300 backdrop-blur-md border border-white/10"
              >
                <X size={20} />
              </button>

              {/* Left Side: Animated Image Carousel */}
              <div className="relative w-full md:w-[55%] h-[40vh] md:h-auto overflow-hidden bg-black flex-shrink-0 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    {selectedProperty.images.length > 0 ? (
                      <Image
                        src={selectedProperty.images[currentImageIndex]}
                        alt={`${selectedProperty.title} - ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                        <div className="text-center text-white/30">
                          <Maximize size={64} className="mx-auto mb-3 opacity-50" />
                          <p className="text-xs uppercase tracking-widest">No Image Available</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                {selectedProperty.images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={prevImage}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#C5A059] hover:text-black transition-all border border-white/10 backdrop-blur-sm"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#C5A059] hover:text-black transition-all border border-white/10 backdrop-blur-sm"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    {/* Thumbnails / Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
                      {selectedProperty.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? "w-4 bg-[#C5A059]" 
                              : "bg-white/30 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badge Overlay */}
                <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                  <span className="px-4 py-1.5 bg-[#C5A059] text-black text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                    {selectedProperty.forType}
                  </span>
                  <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-[0.2em] font-medium border border-white/10 shadow-lg">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-thin scrollbar-thumb-white/10">
                <div className="max-w-xl">
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={14} className="text-[#C5A059]" />
                      <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">{selectedProperty.location}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                      {selectedProperty.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 3 === 2 ? "italic" : ""}>{word} </span>
                      ))}
                    </h2>
                    <div className="inline-block px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059]/30 shadow-[0_0_30px_rgba(197,160,89,0.15)]">
                      <span className="text-3xl md:text-4xl text-[#C5A059] font-serif font-bold tracking-tight">
                        {selectedProperty.price}
                      </span>
                    </div>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-12 border-y border-white/5 py-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Maximize size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Total Area</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.area || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Sofa size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Furnishing</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.furnishing}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Home size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Configuration</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.config}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-white/30 mb-1">
                        <Loader2 size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Floor Level</span>
                      </div>
                      <p className="text-lg font-serif">{selectedProperty.floor || "Ground"}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-12">
                    <h4 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Property Overview</h4>
                    <p className="text-white/60 leading-relaxed font-light text-lg">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {/* Action */}
                  <button className="w-full flex items-center justify-between px-8 py-6 bg-white text-black hover:bg-[#C5A059] hover:text-white transition-all duration-500 group/btn">
                    <span className="text-xs uppercase tracking-[0.4em] font-bold">Schedule A Viewing</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
