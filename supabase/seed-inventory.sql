-- Clear existing inventory data
DELETE FROM inventory;

-- Insert mock inventory data
INSERT INTO inventory (
  sku, type, category, manufacturer, model, capacity, voltage,
  frequency, phases, cooling_class, feoc_compliant, certifications,
  location, quantity, available, price, condition, year_manufactured, notes
) VALUES
-- Distribution Transformers - New
('FLX-D-001', 'new', 'Distribution', 'ABB', 'DTR-500', '500 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Houston, TX', 5, true, '$28,500', 'New', 2024, 'In stock, ready to ship'),
('FLX-D-002', 'new', 'Distribution', 'Siemens', 'DTTH-750', '750 kVA', '13.2kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Houston, TX', 3, true, '$35,200', 'New', 2024, 'Lead time 2-3 weeks'),
('FLX-D-003', 'new', 'Distribution', 'Eaton', 'DT-1000', '1000 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016', 'UL Listed'], 'Dallas, TX', 4, true, '$42,800', 'New', 2024, NULL),
('FLX-D-004', 'new', 'Distribution', 'GE', 'Prolec-1500', '1500 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Phoenix, AZ', 2, true, '$58,500', 'New', 2024, 'Premium efficiency'),
('FLX-D-005', 'new', 'Distribution', 'Howard Industries', 'HPS-2000', '2000 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Laurel, MS', 6, true, '$72,000', 'New', 2024, 'Made in USA'),
('FLX-D-006', 'new', 'Distribution', 'ABB', 'DTR-2500', '2500 kVA', '13.8kV/4160V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Houston, TX', 2, true, '$89,500', 'New', 2024, NULL),
('FLX-D-007', 'new', 'Distribution', 'Schneider Electric', 'Minera-300', '300 kVA', '4160V/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Atlanta, GA', 8, true, '$19,800', 'New', 2024, 'Compact design'),
('FLX-D-008', 'new', 'Distribution', 'Siemens', 'GEAFOL-225', '225 kVA', '480V/208V', 60, 3, 'AN', true, ARRAY['IEEE C57', 'UL Listed'], 'Chicago, IL', 4, true, '$15,200', 'New', 2024, 'Dry type'),

-- Distribution Transformers - Refurbished
('FLX-D-101', 'refurbished', 'Distribution', 'Westinghouse', 'Type C', '500 kVA', '13.8kV/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Houston, TX', 2, true, '$14,500', 'Excellent', 2018, 'Fully reconditioned, new oil'),
('FLX-D-102', 'refurbished', 'Distribution', 'GE', 'Prolec-750', '750 kVA', '13.2kV/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Dallas, TX', 3, true, '$19,800', 'Very Good', 2019, 'Tested and certified'),
('FLX-D-103', 'refurbished', 'Distribution', 'ABB', 'DTR-1000', '1000 kVA', '13.8kV/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Phoenix, AZ', 1, true, '$24,500', 'Excellent', 2020, 'Low hours, like new'),
('FLX-D-104', 'refurbished', 'Distribution', 'Cooper', 'Envirotemp', '1500 kVA', '13.8kV/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Denver, CO', 2, true, '$32,000', 'Good', 2017, 'New bushings installed'),
('FLX-D-105', 'refurbished', 'Distribution', 'Howard Industries', 'HPS-2000', '2000 kVA', '13.8kV/4160V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Laurel, MS', 1, true, '$45,000', 'Very Good', 2019, '5-year warranty available'),

-- Power Transformers - New
('FLX-P-001', 'new', 'Power', 'ABB', 'TrafoStar-5', '5 MVA', '69kV/13.8kV', 60, 3, 'ONAN/ONAF', true, ARRAY['IEEE C57.12', 'ANSI'], 'Houston, TX', 1, true, '$285,000', 'New', 2024, 'Substation class'),
('FLX-P-002', 'new', 'Power', 'Siemens', 'TUNORMA-7.5', '7.5 MVA', '69kV/13.8kV', 60, 3, 'ONAN/ONAF', true, ARRAY['IEEE C57.12', 'ANSI'], 'Charlotte, NC', 1, true, '$385,000', 'New', 2024, '8-week lead time'),
('FLX-P-003', 'new', 'Power', 'GE', 'Prolec-10', '10 MVA', '115kV/13.8kV', 60, 3, 'ONAN/ONAF', true, ARRAY['IEEE C57.12', 'ANSI', 'IEC'], 'Houston, TX', 1, true, '$520,000', 'New', 2024, NULL),
('FLX-P-004', 'new', 'Power', 'Hitachi Energy', 'PowerT-15', '15 MVA', '138kV/13.8kV', 60, 3, 'ONAN/ONAF/OFAF', true, ARRAY['IEEE C57.12', 'ANSI', 'IEC'], 'Raleigh, NC', 1, true, '$725,000', 'New', 2024, 'Premium grade'),
('FLX-P-005', 'new', 'Power', 'ABB', 'TrafoStar-20', '20 MVA', '138kV/34.5kV', 60, 3, 'ONAF/OFAF', true, ARRAY['IEEE C57.12', 'ANSI'], 'Houston, TX', 1, true, '$890,000', 'New', 2024, 'Factory tested'),
('FLX-P-006', 'new', 'Power', 'Siemens', 'TUNORMA-25', '25 MVA', '230kV/69kV', 60, 3, 'ONAF/OFAF', true, ARRAY['IEEE C57.12', 'ANSI', 'IEC'], 'Atlanta, GA', 1, true, '$1,150,000', 'New', 2024, '12-week lead time'),

-- Power Transformers - Refurbished
('FLX-P-101', 'refurbished', 'Power', 'Westinghouse', 'Type HSP', '5 MVA', '69kV/13.8kV', 60, 3, 'ONAN/ONAF', false, ARRAY['IEEE C57.12'], 'Houston, TX', 1, true, '$145,000', 'Very Good', 2015, 'Complete overhaul 2023'),
('FLX-P-102', 'refurbished', 'Power', 'GE', 'Type H', '7.5 MVA', '69kV/13.8kV', 60, 3, 'ONAN/ONAF', false, ARRAY['IEEE C57.12'], 'Dallas, TX', 1, true, '$195,000', 'Excellent', 2017, 'Low hours, utility surplus'),
('FLX-P-103', 'refurbished', 'Power', 'ABB', 'TrafoStar-10', '10 MVA', '115kV/13.8kV', 60, 3, 'ONAN/ONAF', false, ARRAY['IEEE C57.12'], 'Phoenix, AZ', 1, true, '$275,000', 'Good', 2014, 'New windings 2022'),
('FLX-P-104', 'refurbished', 'Power', 'Cooper', 'Kyle-20', '20 MVA', '138kV/13.8kV', 60, 3, 'ONAF/OFAF', false, ARRAY['IEEE C57.12'], 'Denver, CO', 1, true, '$485,000', 'Very Good', 2016, 'Utility decommission'),

-- Specialty Transformers - New
('FLX-S-001', 'new', 'Specialty', 'ABB', 'RESIBLOC', '1000 kVA', '13.8kV/480V', 60, 3, 'AN', true, ARRAY['IEEE C57.12.51', 'UL'], 'Houston, TX', 3, true, '$68,000', 'New', 2024, 'Cast resin dry type'),
('FLX-S-002', 'new', 'Specialty', 'Schneider Electric', 'Trihal', '1500 kVA', '13.8kV/480V', 60, 3, 'AN', true, ARRAY['IEEE C57.12.51', 'UL', 'FM'], 'Chicago, IL', 2, true, '$92,000', 'New', 2024, 'Fire resistant'),
('FLX-S-003', 'new', 'Specialty', 'GE', 'Prolec-ISO', '500 kVA', '480V/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'UL'], 'Houston, TX', 4, true, '$38,500', 'New', 2024, 'Isolation transformer'),
('FLX-S-004', 'new', 'Specialty', 'Hammond Power', 'HPS-Auto', '750 kVA', '480V/240V', 60, 3, 'AN', true, ARRAY['CSA', 'UL'], 'Ontario, Canada', 5, true, '$24,800', 'New', 2024, 'Autotransformer'),
('FLX-S-005', 'new', 'Specialty', 'Eaton', 'VPI-2000', '2000 kVA', '4160V/480V', 60, 3, 'ANAF', true, ARRAY['IEEE C57.12.01', 'UL'], 'Pittsburgh, PA', 2, true, '$115,000', 'New', 2024, 'VPI dry type'),
('FLX-S-006', 'new', 'Specialty', 'Siemens', 'GEAFOL-NEO', '2500 kVA', '13.8kV/480V', 60, 3, 'AF', true, ARRAY['IEEE C57.12.51', 'UL', 'FM'], 'Atlanta, GA', 1, true, '$165,000', 'New', 2024, 'Data center grade'),

-- Specialty Transformers - Refurbished
('FLX-S-101', 'refurbished', 'Specialty', 'ABB', 'RESIBLOC', '750 kVA', '4160V/480V', 60, 3, 'AN', false, ARRAY['IEEE C57.12.51'], 'Houston, TX', 1, true, '$42,000', 'Excellent', 2020, 'Minimal use'),
('FLX-S-102', 'refurbished', 'Specialty', 'Square D', 'DT-1500', '1500 kVA', '13.8kV/480V', 60, 3, 'AA', false, ARRAY['IEEE C57', 'UL'], 'Dallas, TX', 2, true, '$55,000', 'Very Good', 2018, 'Dry type, tested'),
('FLX-S-103', 'refurbished', 'Specialty', 'GE', 'Prolec-ISO', '1000 kVA', '480V/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Phoenix, AZ', 1, true, '$28,500', 'Good', 2017, 'Isolation transformer'),

-- Pad-mount Transformers
('FLX-PM-001', 'new', 'Distribution', 'Cooper', 'Envirotemp-PM', '500 kVA', '13.2kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57.12.34'], 'Houston, TX', 6, true, '$32,500', 'New', 2024, 'Pad-mount, loop feed'),
('FLX-PM-002', 'new', 'Distribution', 'ABB', 'PadMount-750', '750 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57.12.34'], 'Dallas, TX', 4, true, '$41,800', 'New', 2024, 'Pad-mount, radial feed'),
('FLX-PM-003', 'new', 'Distribution', 'Howard Industries', 'HPS-PM-1000', '1000 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57.12.34'], 'Laurel, MS', 3, true, '$52,500', 'New', 2024, 'Three-phase pad-mount'),
('FLX-PM-004', 'refurbished', 'Distribution', 'GE', 'Prolec-PM', '750 kVA', '13.2kV/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57.12.34'], 'Phoenix, AZ', 2, true, '$24,800', 'Very Good', 2019, 'Reconditioned pad-mount'),

-- Additional varied inventory
('FLX-D-009', 'new', 'Distribution', 'Eaton', 'DT-167', '167 kVA', '7200V/240V', 60, 1, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Houston, TX', 12, true, '$8,500', 'New', 2024, 'Single phase'),
('FLX-D-010', 'new', 'Distribution', 'ABB', 'DTR-333', '333 kVA', '7200V/240V', 60, 1, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Dallas, TX', 8, true, '$12,800', 'New', 2024, 'Single phase'),
('FLX-D-011', 'new', 'Distribution', 'Howard Industries', 'HPS-3000', '3000 kVA', '13.8kV/480V', 60, 3, 'ONAN', true, ARRAY['IEEE C57', 'DOE 2016'], 'Laurel, MS', 2, true, '$98,500', 'New', 2024, 'Large distribution'),
('FLX-D-106', 'refurbished', 'Distribution', 'Siemens', 'DTTH-500', '500 kVA', '4160V/480V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Chicago, IL', 3, true, '$16,500', 'Good', 2016, 'Medium voltage'),
('FLX-D-107', 'refurbished', 'Distribution', 'Cooper', 'Envirotemp-2500', '2500 kVA', '13.8kV/4160V', 60, 3, 'ONAN', false, ARRAY['IEEE C57'], 'Denver, CO', 1, true, '$52,000', 'Excellent', 2020, 'Nearly new');

-- Verify the insert
SELECT
  COUNT(*) as total_products,
  SUM(quantity) as total_units,
  COUNT(*) FILTER (WHERE type = 'new') as new_count,
  COUNT(*) FILTER (WHERE type = 'refurbished') as refurbished_count
FROM inventory
WHERE available = true;
