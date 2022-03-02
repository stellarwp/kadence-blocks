# Kadence Block Template

### Required Changes
- String replace `block-template` with the block slug in `/src/blocks/block-template/`
- Edit name, title, description, and keywords in `/src/block-template/block.json`
- Rename `/src/block/block-template/` directory to match the block slug
- Update reference in `src/blocks.js` for `import './blocks/block-template/index.js';` to match block slug
- Edit `/dist/class-kadence-blocks-frontend.php` to 
- Delete this readme file
- Front end CSS is generated and enqueued in `/dist/class-kadence-blocks-frontend.php`
  - Rename and edit `blocks_block_template_array`, `render_block_template_css`, `render_block_template_css_head`
  - References to `kadence/block-template` in this file will need to be updated to match the block slug
