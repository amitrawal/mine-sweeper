require 'pp'

class Board
	STATUS_STARTED = 0
	STATUS_ENDED = 1
	
	attr_accessor :cells, :total_mines, :rows, :cols
	attr_reader :status
	def initialize(r, c, total_mines)
		self.rows = r
		self.cols = c
		self.cells = []
		self.total_mines = total_mines
		reset
	end

	def reset		
		(rows * cols).times do |index|
			cells << Cell.new
		end
		place_mines
	end
	
	def turn_on_cell(index)
		cell = cells[index]
		return if cell.status == Cell::STATUS_ON		
		
		cell.turn_on
		if cell.type == Cell::TYPE_MINE
			@status = STATUS_ENDED
			return
		end
		
		if cell.type == Cell::TYPE_EMPTY
			turn_on_adjacent_cells(index)
		end
	end
	
	def turn_on_adjacent_cells(from_index)
		cell_indexes = get_adjacent_cell_indexes(from_index)
		cell_indexes.each do |cell_index|
			cell = cells[cell_index]
			next if cell.status == Cell::STATUS_ON
			if cell.type == Cell::TYPE_EMPTY
				cell.turn_on
				turn_on_adjacent_cells(cell_index)
			elsif cell.type == Cell::TYPE_MARKED
				cell.turn_on
			end
		end
	end
	
	def hint
	end
	
	def get_adjacent_cell_indexes(from_index)
		row, col = get_row_col(from_index)
		cell_indexes = []
		cell_indexes << get_relative_index(row,col, :above)
		cell_indexes << get_relative_index(row,col, :bottom)
		cell_indexes << get_relative_index(row,col, :left)
		cell_indexes << get_relative_index(row,col, :right)
		cell_indexes << get_relative_index(row,col, :above_left)
		cell_indexes << get_relative_index(row,col, :above_right)
		cell_indexes << get_relative_index(row,col, :bottom_left)
		cell_indexes << get_relative_index(row,col, :bottom_right)
		cell_indexes
	end
	
	def place_mines
		#~ mine_positions = (0..cells.length - 1).to_a.sample total_mines				
		mine_positions = (1..cells.length - 1).to_a.sample total_mines
		mine_positions = [55, 53, 6, 17, 57, 58, 34, 40, 25, 41]
		p mine_positions
		mine_positions.each do |index|
			cells[index].type = Cell::TYPE_MINE			
			mark_adjacent_cells(index)
		end		
	end
	
	def mark_adjacent_cells(index)		
		get_adjacent_cell_indexes(index).each do |cell_index|
			cells[cell_index].mark if can_mark_cell?(cell_index)
		end

		#~ p ""
	end
	
	def display
		rows.times do |r|
			v = '|'
			cols.times do |c|
				v += "     " + cells[get_cell(r + 1,c + 1)].display + "    |"				
			end
			p v
		end
	end
	
	private
	
	def get_relative_index(row, col, direction)
		case direction 
		when :above
			row - 1 > 0 ? get_cell(row - 1, col) : -1
		when :bottom
			row + 1 <= rows ? get_cell(row + 1, col) : -1
		when :left
			col - 1 > 0 ? get_cell(row, col - 1)  : -1
		when :right
			col + 1 <= cols ? get_cell(row, col + 1)  : -1
		when :above_left
			(row - 1 > 0 && col - 1 > 0) ? get_cell(row - 1, col - 1)  : -1
		when :above_right
			(row - 1 > 0 && col + 1 <= cols) ? get_cell(row - 1, col + 1)  : -1
		when :bottom_left
			(row + 1 <= rows && col - 1 > 0) ? get_cell(row + 1, col - 1)  : -1
		when :bottom_right
			(row + 1 <= rows && col +1 <= cols) ? get_cell(row + 1, col + 1)   : -1						 
		end
	end
	
	def can_mark_cell?(index)
		!out_of_bounds?(index) && cells[index].type != Cell::TYPE_MINE
	end
	
	def out_of_bounds?(index)		
		index < 0 || index >= cells.length
	end
	
	def get_row_col(index)
		r = index/cols
		c = index % cols
		[r + 1, c + 1]
	end
	
	def get_cell(r,c)
		(r -1) * cols + (c -1)
	end
end

class Cell	
	TYPE_EMPTY 	= 0
	TYPE_MINE	= 1
	TYPE_MARKED	= 2
	
	STATUS_OFF = 0
	STATUS_ON = 1
	
	attr_accessor :type, :tag, :status
	def initialize(type = TYPE_EMPTY)
		self.type = type
		self.tag = 0
		self.status = STATUS_OFF
	end
	
	def mark
		self.type = TYPE_MARKED
		self.tag += 1
	end
	
	def turn_on
		self.status = STATUS_ON
	end
	
	def display
		return ' ' if status == STATUS_OFF
		case type
		when TYPE_MINE
			'* '
		when TYPE_MARKED
			self.tag.to_s
		else
			'0'
		end
	end
end

ROWS = 8
COLS = 8
MINES = 10
board = Board.new(ROWS, COLS, MINES)
board.display
p ""
board.turn_on_cell(0)
board.display
p ""
board.turn_on_cell(16)
board.display

p ""
board.turn_on_cell(17)
board.display
p board.status