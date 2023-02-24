import React, { useState } from 'react'
import { ChromePicker, ColorResult, RGBColor } from 'react-color'

export type SettingOptions = {
	fontSize: number // postfix px
	lineHeight: number
	letterSpacing: number // postfix px
	color: ColorResult
	backgroundColor: ColorResult
}

type OptionKey = keyof SettingOptions

const black: ColorResult = {
	hsl: { h: 0, s: 0, l: 0, a: 1 },
	hex: '#000000',
	rgb: { r: 0, g: 0, b: 0, a: 1 },
}

const white: ColorResult = {
	hsl: { h: 0, s: 0, l: 1, a: 1 },
	hex: '#ffffff',
	rgb: { r: 255, g: 255, b: 255, a: 1 },
}

export const defaultSetting: SettingOptions = {
	fontSize: 16,
	lineHeight: 1.2,
	letterSpacing: 0.032,
	color: black,
	backgroundColor: white,
}

export default function SettingPopup({
	setting,
	setSetting,
}: {
	setting: SettingOptions
	setSetting: React.Dispatch<React.SetStateAction<SettingOptions>>
}) {
	const [show, setShow] = useState(false)

	const setOption = (key: OptionKey, val: any) =>
		setSetting(setting => ({
			...setting,
			[key]: val,
		}))

	const changeHandler = (key: OptionKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
		let val = e.target.value
		setOption(key, val)
	}

	return (
		<>
			<button
				className="ts-button is-inverted"
				onClick={() => setShow(true)}
				style={{
					borderColor: setting.backgroundColor.hex,
					backgroundColor: setting.backgroundColor.hex,
					color: setting.color.hex,
				}}
			>
				Setting
			</button>

			<div className={'ts-modal' + (show ? ' is-visible' : '')}>
				<div className="content" style={{ overflow: 'unset' }}>
					<div className="ts-content is-center-aligned is-vertically-padded">
						<div className="ts-input is-end-labeled is-start-labeled">
							<span className="label">大小</span>
							<input
								className="text"
								type="number"
								value={setting.fontSize}
								onChange={changeHandler('fontSize')}
								min={1}
								max={72}
							/>
							<span className="label">px</span>
						</div>
						<div className="ts-input">
							<input
								className="text"
								type="range"
								value={setting.fontSize}
								onChange={changeHandler('fontSize')}
								min={1}
								max={72}
							/>
						</div>
						<div className="ts-space" />
						<div className="ts-input is-end-labeled is-start-labeled">
							<span className="label">行高</span>
							<input
								className="text"
								type="number"
								value={setting.lineHeight}
								onChange={changeHandler('lineHeight')}
								min={0}
								max={2}
								step={0.1}
							/>
							<span className="label" style={{ color: 'rgba(0,0,0,0)' }}>
								XD
							</span>
						</div>
						<div className="ts-input">
							<input
								className="text"
								type="range"
								value={setting.lineHeight}
								onChange={changeHandler('lineHeight')}
								min={0}
								max={2}
								step={0.1}
							/>
						</div>
						<div className="ts-space" />
						<div className="ts-input is-end-labeled is-start-labeled">
							<span className="label">行距</span>
							<input
								className="text"
								type="number"
								value={setting.letterSpacing}
								onChange={changeHandler('letterSpacing')}
								min={-10}
								max={10}
							/>
							<span className="label">px</span>
						</div>
						<div className="ts-input">
							<input
								className="text"
								type="range"
								value={setting.letterSpacing}
								onChange={changeHandler('letterSpacing')}
								min={-10}
								max={10}
							/>
						</div>
						<div className="ts-space" />
						<ColorPicker
							color={setting.color}
							setColor={color => {
								let html = document.querySelector('html')
								if (html) html.style.setProperty('--ts-gray-800', color.hex)
								setOption('color', color)
							}}
							label="文字"
						/>
						<div className="ts-space" />
						<ColorPicker
							color={setting.backgroundColor}
							setColor={color => {
								let html = document.querySelector('html')
								if (html) html.style.setProperty('--ts-gray-50', color.hex)
								setOption('backgroundColor', color)
							}}
							label="背景"
						/>
					</div>
					<button
						className="ts-button is-fluid is-inverted"
						onClick={() => setShow(false)}
						style={{
							borderColor: setting.backgroundColor.hex,
							backgroundColor: setting.backgroundColor.hex,
							color: setting.color.hex,
						}}
					>
						Close
					</button>
				</div>
			</div>
		</>
	)
}

function ColorPicker({
	color,
	setColor,
	label,
}: {
	color: ColorResult
	setColor: React.Dispatch<ColorResult>
	label: string
}) {
	const [show, setShow] = useState(false)

	// https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
	const brightness = (color: RGBColor) => Math.round((color.r * 299 + color.g * 587 + color.b * 114) / 1000)

	return (
		<>
			<div className="ts-input is-start-labeled is-fluid">
				<span className="label">{label}</span>
				<input
					type="color"
					onClick={e => {
						e.preventDefault()
						setShow(show => !show)
					}}
					value={color.hex}
				/>
			</div>
			{show ? (
				<div
					style={{
						position: 'absolute',
						zIndex: '2',
					}}
				>
					<div
						style={{
							position: 'fixed',
							top: '0px',
							right: '0px',
							bottom: '0px',
							left: '0px',
						}}
						onClick={() => setShow(false)}
					/>
					<ChromePicker color={color.hex} onChange={setColor} />
				</div>
			) : null}
		</>
	)
}
