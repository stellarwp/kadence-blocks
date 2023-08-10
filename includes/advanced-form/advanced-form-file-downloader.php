<?php

/**
 * Safe downloading of Advanced Form File Submissions.
 */
class Kadence_Blocks_Form_File_Downloader {

	/**
	 * Check if this is a download file request and file exists.
	 *
	 * @return void
	 */
	public static function check_download_request() {
		if ( ! empty( $_GET['kadence-form-download'] ) ) {

			$upload_dir = wp_upload_dir();

			if ( isset( $upload_dir['basedir'] ) ) {
				$path = $upload_dir['basedir'] . '/' . $_GET['kadence-form-download'];

				if( realpath( $path ) === $path && file_exists( $upload_dir['basedir'] . '/' . $_GET['kadence-form-download'] ) ) {
					Kadence_Blocks_Form_File_Downloader::download( $upload_dir['basedir'] . '/' . $_GET['kadence-form-download'] );
				}
			}
		}
	}

	/**
	 * Start download of file.
	 *
	 * @param $file
	 *
	 * @return void
	 */
	public static function download( $file ) {
		$filetype = wp_check_filetype( $file );
		$content_type = !empty( $filetype['type']) ? $filetype['type'] : 'application/octet-stream';
		$content_disposition = 'inline';

		nocache_headers();
		header( 'X-Robots-Tag: noindex', true );
		header( 'Content-Type: ' . $content_type );
		header( 'Content-Description: File Transfer' );
		header( 'Content-Disposition: ' . $content_disposition . '; filename="' . wp_basename( $file ) . '"' );
		header( 'Content-Transfer-Encoding: binary' );

		if ( ob_get_contents() ) {
			ob_end_clean();
		}
		self::readfile_chunked( $file );
		die();
	}

	/**
	 * Reads file in chunks so big downloads are possible without changing PHP.INI
	 * See https://github.com/bcit-ci/CodeIgniter/wiki/Download-helper-for-large-files
	 *
	 * @access   public
	 * @param    string  $file      The file
	 * @param    boolean $retbytes  Return the bytes of file
	 * @return   bool|string        If string, $status || $cnt
	 */
	public static function readfile_chunked( $file, $retbytes = true ) {

		$chunksize = 1024 * 1024;
		$buffer    = '';
		$cnt       = 0;
		$handle    = @fopen( $file, 'r' );

		if ( $size = @filesize( $file ) ) {
			header( 'Content-Length: ' . $size );
		}

		if ( false === $handle ) {
			return false;
		}

		while ( ! @feof( $handle ) ) {
			$buffer = @fread( $handle, $chunksize );
			echo $buffer;

			if ( $retbytes ) {
				$cnt += strlen( $buffer );
			}
		}

		$status = @fclose( $handle );

		if ( $retbytes && $status ) {
			return $cnt;
		}

		return $status;
	}
}
