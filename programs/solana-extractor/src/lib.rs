use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("E8pjtGJEDxAWBc1iBDiTjHTM5LaMHE1c6nASc6gaL5vq");

#[program]
pub mod solana_extractor {
    use super::*;

    pub fn save_metadata(ctx: Context<SaveMetadata>, data: String) -> Result<()> {
        let record: &mut Account<Metadata> = &mut ctx.accounts.metadata;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if data.chars().count() > 1000 {
            return Err(ErrorCode::MetadataTooLong.into())
        }

        record.author = *author.key;
        record.timestamp = clock.unix_timestamp;
        record.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SaveMetadata<'info> {
    #[account(init, payer = author, space = Metadata::LEN)]
    pub metadata: Account<'info, Metadata>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Metadata {
    pub author: Pubkey,
    pub timestamp: i64,
    pub data: String,
}


const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const DATA_LENGTH: usize = 1000 * 4;

impl Metadata {
    const LEN: usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + TIMESTAMP_LENGTH +
                        STRING_LENGTH_PREFIX + DATA_LENGTH;

}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided metat should be 1000 characters long maximum.")]
    MetadataTooLong
}